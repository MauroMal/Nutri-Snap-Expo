import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "@/context/supabase-provider";
import { LogBox } from "react-native";

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

	if (!initialized) return;
	else {
		SplashScreen.hideAsync();
	}

	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Protected guard={!!session}>
				<Stack.Screen name="(protected)" />
			</Stack.Protected>

			<Stack.Protected guard={!session}>
				<Stack.Screen name="(public)/welcome" />
			</Stack.Protected>
		</Stack>
	);
}