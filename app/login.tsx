// import { View, StyleSheet, TextInput, Button, Text, Alert } from 'react-native';
// import { supabase } from '@/lib/supabase';
// import React, { useState } from 'react';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   async function signInWithEmail() {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) Alert.alert(error.message);
//     setLoading(false);
//   }

//   async function signUpWithEmail() {
//     setLoading(true);
//     const { data: { session }, error } = await supabase.auth.signUp({ email, password });
//     if (error) Alert.alert(error.message);
//     if (!session) Alert.alert('Please check your inbox for email verification!');
//     setLoading(false);
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to NutriSnap</Text>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setEmail}
//           value={email}
//           placeholder="email@address.com"
//           autoCapitalize="none"
//           keyboardType="email-address"
//           placeholderTextColor="#999"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setPassword}
//           value={password}
//           placeholder="Password"
//           autoCapitalize="none"
//           secureTextEntry
//           placeholderTextColor="#999"
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <Button title="Sign In" disabled={loading} onPress={signInWithEmail} />
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button title="Sign Up" disabled={loading} onPress={signUpWithEmail} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 24,
//     paddingTop: 80,
//     flex: 1,
//     backgroundColor: '#f4f4f4',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     marginBottom: 40,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 6,
//     color: '#333',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     fontSize: 16,
//     color: '#000',
//   },
//   buttonContainer: {
//     marginTop: 10,
//   },
// });