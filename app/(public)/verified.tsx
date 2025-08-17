import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/supabase-provider";
import { Text, View, ActivityIndicator } from "react-native";

export default function VerifiedScreen() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/(protected)/(tabs)");
    }
  }, [session]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Verifying...</Text>
    </View>
  );
}