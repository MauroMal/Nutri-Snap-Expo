import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const appIcon = require("@/assets/images/NutriSnapLogo-2.png");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <Image source={appIcon} style={styles.image} />
        <Text style={styles.title}>NutriSnap</Text>
        <Text style={styles.subtitle}>
          An app for logging food and nutrition
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={() => router.push("/sign-up")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 16,
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    gap: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: -10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    width: 200,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  blueButton: {
    backgroundColor: "#1e90ff",
  },
  greenButton: {
    backgroundColor: "#00cc66",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});