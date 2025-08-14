import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import Ionicons from "@expo/vector-icons/Ionicons";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFirstTimeOpen } from '@/hooks/useFirstTimeOpen';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // const { isFirstTime, isLoading } = useFirstTimeOpen();

  // if (isLoading) return <></>;
  // if (isFirstTime) return <Redirect href={"/onboarding"} />;

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#7ED957',
      headerStyle: {
        backgroundColor: '#25292e',
      },
      headerShadowVisible: false,
      headerTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: '#25292e',
      },
    }}
    >
      <Tabs.Screen name="index" options={{ 
          headerTitle: "Nutri-Snap", 
          tabBarLabel: "Home",
          tabBarIcon: ({color, focused}) => (
              <Ionicons 
              name={focused ? "home-sharp" : "home-outline"} 
              color = {color} 
              size={24} 
              />
          ),
          }} 
      />
      <Tabs.Screen
          name="search"
          options={{
          headerTitle: "Search",
          tabBarLabel: "Search",
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={24}
              />
          ),
          }}
      />
      <Tabs.Screen
          name="camera"
          options={{
          headerTitle: "Camera",
          tabBarLabel: "Camera",
          headerStyle: {
            backgroundColor: 'black',
          },
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
              name={focused ? "camera" : "camera-outline"}
              color={color}
              size={24}
              />
          ),
          }}
      />
      <Tabs.Screen
          name="data"
          options={{
          headerTitle: "Log",
          tabBarLabel: "Log",
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              color={color}
              size={24}
              />
          ),
          }}
      />
      <Tabs.Screen
          name="profile"
          options={{
          headerTitle: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
              />
          ),
          }}
      />
      <Tabs.Screen 
          name="+not-found" 
          options={{}} />
  </Tabs>
);
}

