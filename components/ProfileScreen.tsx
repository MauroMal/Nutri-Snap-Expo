import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/supabase-provider";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";

export default function ProfileScreen({
  onBack,
  limits,
  setLimits,
}: {
  onBack: () => void;
  limits: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  setLimits: React.Dispatch<
    React.SetStateAction<{
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      sugar: number;
    }>
  >;
}) {
  const { session, signOut } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [localLimits, setLocalLimits] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    sugar: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, calories_limit, protein_limit, carbs_limit, fat_limit, sugar_limit"
        )
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setFullName(data.full_name);
        setLocalLimits({
          calories: String(data.calories_limit || ""),
          protein: String(data.protein_limit || ""),
          carbs: String(data.carbs_limit || ""),
          fat: String(data.fat_limit || ""),
          sugar: String(data.sugar_limit || ""),
        });
      }

      setLoading(false);
    }

    fetchProfile();
  }, [session]);

  const handleSave = async () => {
    const newLimits = {
      calories: Number(localLimits.calories),
      protein: Number(localLimits.protein),
      carbs: Number(localLimits.carbs),
      fat: Number(localLimits.fat),
      sugar: Number(localLimits.sugar),
    };

    setLimits(newLimits);

    const { error } = await supabase
      .from("profiles")
      .update({
        calories_limit: newLimits.calories,
        protein_limit: newLimits.protein,
        carbs_limit: newLimits.carbs,
        fat_limit: newLimits.fat,
        sugar_limit: newLimits.sugar,
      })
      .eq("id", session?.user?.id);

    if (error) {
      Alert.alert("Update failed", "Could not update limits.");
    } else {
      Alert.alert("Saved", "Limits updated.");
      setTimeout(() => onBack(), 500);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(public)/welcome");
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <SymbolView name="chevron.left.circle" size={36} tintColor="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome{fullName ? `, ${fullName}` : ""}!</Text>

      <View style={styles.card}>
        {["calories", "protein", "carbs", "fat", "sugar"].map((key) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)} Limit
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder={`Enter ${key} limit`}
              value={localLimits[key as keyof typeof localLimits]}
              onChangeText={(text) =>
                setLocalLimits((prev) => ({ ...prev, [key]: text }))
              }
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#222",
    marginBottom: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#C62828",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});