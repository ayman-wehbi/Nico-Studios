import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
        await sendPasswordResetEmail(auth, email);
      Alert.alert("A link to reset your password has been sent to your email if registered");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        placeholderTextColor={"grey"}
        keyboardType="email-address"
      />
      <Pressable style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Request Password Reset</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: "2%",
    backgroundColor: "#0f0f0f", // Dark background
  },
  input: {
    width: '90%', // Match the loginContainer width
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 9,
    color: "white", // Text color
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FACE88',
    padding: 10,
    borderRadius: 9,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
},
  buttonText: {
    color: '#121a39', // Dark text color for contrast
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
