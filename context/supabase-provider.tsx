import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

type AuthState = {
  initialized: boolean;
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    first_name?: string,
    last_name?: string
  ) => Promise<"signed_in" | "needs_verification" | "error" | "error_email_in_use">;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  initialized: false,
  session: null,
  signUp: async () => "error",
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const signUp = async (
    email: string,
    password: string,
    first_name?: string,
    last_name?: string
  ) => {
    const full_name = `${first_name?.trim() ?? ""} ${last_name?.trim() ?? ""}`.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          email,
          avatar_url: "",
        },
      },
    });

    if (!error && !data.session && !data.user?.aud) {
      return "error_email_in_use";
    }
  
    if (error) {
      console.log("Signup error:", error);
      // This catches verified emails
      if (error.message.toLowerCase().includes("already registered")) {
        return "error_email_in_use";
      }
      return "error";
    }
  
    // Catch case where email already exists but isn't verified
    if (!data.session && data.user && data.user.identities?.length === 0) {
      console.log("Email exists but unverified");
      return "error_email_in_use";
    }
  
    if (data.session) {
      setSession(data.session);
      return "signed_in";
    } else {
      return "needs_verification";
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      return Promise.reject(error);
    }

    if (data.session) {
      setSession(data.session);
      console.log("User signed in:", data.user);
    } else {
      console.log("No user returned from sign in");
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
    } else {
      console.log("User signed out");
      setSession(null);
    }
  };

  useEffect(() => {
    const validateSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const { data: user, error } = await supabase.auth.getUser();

      if (user && !error) {
        setSession(sessionData.session);
      } else {
        setSession(null);
        await supabase.auth.signOut(); // clear invalid session
      }

      setInitialized(true);
    };

    validateSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        const { data: existingProfile, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!existingProfile && !error) {
          const full_name = session.user.user_metadata?.full_name || "";
          const { error: insertError } = await supabase.from("profiles").insert({
            id: session.user.id,
            email: session.user.email,
            full_name,
          });

          if (insertError) {
            console.error("Insert failed after auth state change:", insertError);
          } else {
            console.log("Profile inserted after auth state change");
          }
        }
      }
    });
  }, []);

  // Redirect to home if user verifies email and logs in
  function RedirectAfterVerification() {
    const router = useRouter();

    useEffect(() => {
      const { data: subscription } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user?.email_confirmed_at) {
            router.replace("/(protected)/(tabs)");
          }
        }
      );

      return () => {
        subscription.subscription.unsubscribe();
      };
    }, []);

    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        initialized,
        session,
        signUp,
        signIn,
        signOut,
      }}
    >
      <RedirectAfterVerification />
      {children}
    </AuthContext.Provider>
  );
}