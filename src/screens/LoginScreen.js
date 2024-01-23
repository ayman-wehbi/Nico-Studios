import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { useNavigation} from '@react-navigation/native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const fetchFonts = () => {
    
    return Font.loadAsync({
      'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
      'Cursives': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
    });
  };
  

const LoginScreen = (props) => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);


    useEffect ( ( ) => {
        const unsubscribe = auth.onAuthStateChanged (user => {
        if (user) {
        navigation.navigate("Projects")
        }})
        return unsubscribe
        }, [])


    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user.email)
                 navigation.navigate("Projects");
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // .. Handle errors here, like wrong password or user not found
            });
    };
    

    const handleSignUp = () => {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user.email)
                navigation.navigate("Projects")
            })
            .catch((error) => {
                console.log(error)
            });
    };
    
    if (!fontLoaded) {
        return (
        <AppLoading
            startAsync={fetchFonts}
            onFinish={() => setFontLoaded(true)}
            onError={console.warn}
        />
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>NICO STUDIOS</Text>
                <Text style={styles.subtitle}>for songwriters</Text>
            </View>
            <View style={styles.loginContainer}>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={"grey"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={"grey"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: "2%",
        backgroundColor: "#0f0f0f"
    },
    titleContainer: {
        marginTop:"50%",
        alignItems: 'flex-end',
        marginBottom: "10%"
    },
    title: {
        fontSize: 45,
        color: '#Face88',
        fontFamily: "Lemon",
        marginBottom: -22
    },
    subtitle: {
        fontSize: 20,
        color: '#f754c8',
        marginLeft: 5, // Adjust as needed
        fontFamily: "Cursives",
    },
    loginContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 9,
        color: "white",
    },
    button: {
        backgroundColor: '#FACE88',
        padding: 10,
        borderRadius: 9,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#121a39',
        fontSize: 16,
    }
});

export default LoginScreen;



export default LoginScreen;

