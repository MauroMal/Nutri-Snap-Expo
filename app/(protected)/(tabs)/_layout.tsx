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
        
      tabBarActiveTintColor: '#000', //#7ED957
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerShadowVisible: false,
      tabBarShowLabel:false ,
      headerTintColor: '#000',
      tabBarStyle: {
        backgroundColor: '#fff',
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
              size={26} 
              />
          ),
          }} 
      />
      <Tabs.Screen
          name="search"
          options={{
          headerTitle: "Search",
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={26}
              />
          ),
          }}
      />
      <Tabs.Screen
        name="camera"
        options={{
            headerShown: false,
            tabBarLabel: "Camera",
            tabBarIcon: ({ color, focused }) => (
            <Ionicons
                name={focused ? "camera" : "camera-outline"}
                color={color}
                size={26}
            />
            ),
            tabBarStyle: {
            backgroundColor: "#000",
            },
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#888", 
        }}
        />
      <Tabs.Screen
          name="data"
          options={{
          headerTitle: "Log",
          tabBarLabel: "Log",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
              <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              color={color}
              size={26}
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
              size={26}
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

