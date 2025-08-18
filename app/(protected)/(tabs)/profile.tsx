import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/supabase-provider";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setFullName(data.full_name);
      }

      setLoading(false);
    }

    fetchProfile();
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(public)/welcome"); // send to welcome screen after logout
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{fullName ? `, ${fullName}` : ""}!</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
  },
});