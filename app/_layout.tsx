import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { AuthProvider, useAuth } from "@/context/supabase-provider";
import { LogBox } from "react-native";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

LogBox.ignoreAllLogs(true);

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 400,
	fade: true,
});

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootNavigator />
		</AuthProvider>
	);
}

function RootNavigator() {
	const { initialized, session } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const handleUrl = async ({ url }: { url: string }) => {
			const parsed = Linking.parse(url);
			if (parsed.path === "verified") {
				const { data } = await supabase.auth.getSession();
				if (data.session) {
					router.replace("/(protected)/(tabs)");
				}
			}
		};

		// Listen to future and initial deep links
		const sub = Linking.addEventListener("url", handleUrl);
		Linking.getInitialURL().then((url) => {
			if (url) handleUrl({ url });
		});

		return () => sub.remove();
	}, []);

	if (!initialized) return;
	else SplashScreen.hideAsync();

	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Protected guard={!!session}>
				<Stack.Screen name="(protected)" />
			</Stack.Protected>

			<Stack.Protected guard={!session}>
				<Stack.Screen name="(public)/welcome" />
				<Stack.Screen name="(public)/verified" />
			</Stack.Protected>
		</Stack>
	);
}