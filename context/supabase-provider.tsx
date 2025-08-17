import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type AuthState = {
	initialized: boolean;
	session: Session | null;
	signUp: (email: string, password: string, first_name?: string, last_name?: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);

	const signUp = async (email: string, password: string, first_name?: string, last_name?: string) => {
    const full_name = `${first_name?.trim() ?? ""} ${last_name?.trim() ?? ""}`.trim();
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          email,
          avatar_url: "", // optional: avoids null value in trigger
        },
      },
    });
  
    if (error) {
      console.error("Error signing up:", error);
      return;
    }
  
    console.log("User signed up:", data.user);
  
    if (data.session) {
      setSession(data.session);
    } else {
      console.log("No session yet — may need email verification");
    }
  };

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
      // throw new Error(error.message);
			// console.error("Error signing in:", error);
			// return;
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
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
    
      // if signed in, check if profile exists, and insert if missing
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
					if (insertError) console.error("Insert failed after auth state change:", insertError);
					else console.log("Profile inserted after auth state change");
        }
      }
    });
		setInitialized(true);
	}, []);

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
			{children}
		</AuthContext.Provider>
	);
}