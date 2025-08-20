import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBar from '@/components/ui/TabBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTintColor: '#000',
      }}
      tabBar={(props) => <TabBar {...props} />} // ← custom floating tab bar here
    >
      <Tabs.Screen name="index" options={{ headerTitle: "Nutri-Snap", tabBarLabel: "Search", headerShown: false  }} />
      {/* <Tabs.Screen name="search" options={{ headerTitle: "Search", headerShown: false }} /> */}
      <Tabs.Screen
  name="camera"
  options={{
    headerShown: false,
    tabBarLabel: "Camera",
    tabBarStyle: {
      backgroundColor: "#000", // dark tab bar
    },
    tabBarActiveTintColor: "#fff",
    tabBarInactiveTintColor: "#888",
  }}
/>
      <Tabs.Screen name="data" options={{ headerTitle: "Log", headerShown: false }} />
      {/* <Tabs.Screen name="profile" options={{ headerTitle: "Profile" }} /> */}
      <Tabs.Screen name="+not-found" options={{}} />
    </Tabs>
  );
}
