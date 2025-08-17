import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import * as z from "zod";
import { useAuth } from "@/context/supabase-provider";
import { useEffect } from "react";


const formSchema = z
  .object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/(?=.*[a-z])/, "Include lowercase")
      .regex(/(?=.*[A-Z])/, "Include uppercase")
      .regex(/(?=.*[0-9])/, "Include number")
      .regex(/(?=.*[!@#$%^&*])/, "Include special character"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      router.replace("/(protected)/(tabs)");
    }
  }, [session]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSignUpError("");
  
    const result = await signUp(data.email, data.password, data.first_name, data.last_name);
  
    if (result === "signed_in") {
      router.replace("/(protected)/(tabs)");
    } else if (result === "needs_verification") {
      setSignUpError("Check your email to verify your account.");
    } else if (result === "error_email_in_use") {
      setSignUpError("This email is already in use.");
    } else {
      setSignUpError("Sign-up failed. Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.header}>Sign Up</Text>

        <Controller
          control={control}
          name="first_name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="First Name"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.first_name && <Text style={styles.error}>{errors.first_name.message}</Text>}

        <Controller
          control={control}
          name="last_name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.last_name && <Text style={styles.error}>{errors.last_name.message}</Text>}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <View style={styles.passwordWrapper}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                onChangeText={onChange}
                value={value}
                textContentType="oneTimeCode"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#aaa" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <View style={styles.passwordWrapper}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Confirm Password"
                autoCapitalize="none"
                secureTextEntry={!showConfirm}
                style={styles.passwordInput}
                onChangeText={onChange}
                value={value}
                textContentType="oneTimeCode"
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#aaa" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.orangeButton]}
          onPress={() => router.replace("/(public)/welcome")}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        {signUpError ? <Text
          style={[
            styles.authError,
            signUpError.toLowerCase().includes("check your email")
              ? styles.successMessage
              : null,
          ]}
        >
          {signUpError}
        </Text> : null}
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
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#25292e",
    borderColor: "#fff",
    borderWidth: 2,
    padding: 12,
    borderRadius: 12,
    width: "80%",
    fontSize: 18,
    marginBottom: 10,
    color: "#fff",
  },
  passwordWrapper: {
    width: "80%",
    position: "relative",
    marginBottom: 10,
  },
  passwordInput: {
    backgroundColor: "#25292e",
    borderColor: "#fff",
    borderWidth: 2,
    padding: 12,
    borderRadius: 12,
    fontSize: 18,
    color: "#fff",
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -11 }],
  },
  error: {
    color: "#ff4d4d",
    marginBottom: 6,
    fontSize: 12,
  },
  authError: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
    backgroundColor: "#3a3a3a",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  button: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
    width: "80%",
  },
  greenButton: {
    backgroundColor: "#00cc66",
  },
  orangeButton: {
    backgroundColor: "orange",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  successMessage: {
    color: "#00cc66",
  },
});