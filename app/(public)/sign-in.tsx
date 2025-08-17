import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import * as z from "zod";
import { useAuth } from "@/context/supabase-provider";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setAuthError(""); // Clear previous error
      await signIn(data.email, data.password);
      router.replace("/(protected)/(tabs)");
    } catch (error: any) {
      console.error(error.message);
      setAuthError("Invalid email or password");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Sign In</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

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
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.redButton]}
          onPress={() => router.replace("/(public)/welcome")}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        {authError ? (
          <Text style={styles.authError}>{authError}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 16,
    justifyContent: "space-around",
  },
  authError: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    backgroundColor: "#3a3a3a",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#fff",
    alignSelf: "center",
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
    marginBottom: 8,
    fontSize: 12,
  },
  loginError: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 12,
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
  redButton: {
    backgroundColor: "orange",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});