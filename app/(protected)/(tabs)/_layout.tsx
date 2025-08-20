// import { Redirect, Tabs } from 'expo-router';
// import React from 'react';
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs screenOptions={{
        
//       tabBarActiveTintColor: '#000', //#7ED957
//       headerStyle: {
//         backgroundColor: '#fff',
//       },
//       headerShadowVisible: false,
//       tabBarShowLabel:false ,
//       headerTintColor: '#000',
//       tabBarStyle: {
//         position: 'absolute',
//         bottom: 20,
//         left: 20,
//         right: 20,
//         elevation: 10,
//         backgroundColor: '#fff',
//         borderRadius: 30,
//         height: 70,
//         paddingBottom: 10,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//       },
//     }}
//     >
//       <Tabs.Screen name="index" options={{ 
//           headerTitle: "Nutri-Snap", 
//           tabBarLabel: "Home",
//           tabBarIcon: ({color, focused}) => (
//               <Ionicons 
//               name={focused ? "home-sharp" : "home-outline"} 
//               color = {color} 
//               size={26} 
//               />
//           ),
//           }} 
//       />
//       <Tabs.Screen
//           name="search"
//           options={{
//           headerTitle: "Search",
//           tabBarLabel: "Search",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//               <Ionicons
//               name={focused ? "search" : "search-outline"}
//               color={color}
//               size={26}
//               />
//           ),
//           }}
//       />
//       <Tabs.Screen
//         name="camera"
//         options={{
//             headerShown: false,
//             tabBarLabel: "Camera",
//             tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//                 name={focused ? "camera" : "camera-outline"}
//                 color={color}
//                 size={26}
//             />
//             ),
//             tabBarStyle: {
//             backgroundColor: "#000",
//             },
//             tabBarActiveTintColor: "#fff",
//             tabBarInactiveTintColor: "#888", 
//         }}
//         />
//       <Tabs.Screen
//           name="data"
//           options={{
//           headerTitle: "Log",
//           tabBarLabel: "Log",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//               <Ionicons
//               name={focused ? "bar-chart" : "bar-chart-outline"}
//               color={color}
//               size={26}
//               />
//           ),
//           }}
//       />
//       <Tabs.Screen
//           name="profile"
//           options={{
//           headerTitle: "Profile",
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color, focused }) => (
//               <Ionicons
//               name={focused ? "person" : "person-outline"}
//               color={color}
//               size={26}
//               />
//           ),
//           }}
//       />
//       <Tabs.Screen 
//           name="+not-found" 
//           options={{}} />
//   </Tabs>
// );
// }

import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabBar from '@/components/ui/TabBar';
import { StatusBar } from 'expo-status-bar';

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
