import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert, Modal } from 'react-native';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { useNavigation} from '@react-navigation/native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Call this function to keep the splash screen visible
SplashScreen.preventAutoHideAsync();

const IndexScreen = (props) => {
    const navigation = useNavigation();
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Pre-load fonts, make any API calls you need to do here
                await Font.loadAsync({
                    'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
                    'Cursives': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
                });

            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (appIsReady) {
            const unsubscribe = auth.onAuthStateChanged(user => {
                if (user) {
                    // Reset the navigation stack and navigate to the SongList
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'SongList' }],
                    });
                } else {
                    // Navigate to the LoginScreen
                    navigation.navigate('LoginScreen');
                }
            });
            return unsubscribe;
        }
    }, [appIsReady, navigation]);

    if (!appIsReady) {
        return null;
    }


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>NICO STUDIOS</Text>
                <Text style={styles.subtitle}>for songwriters</Text>
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
        marginTop:"75%",
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "#face88",
        borderRadius: 10,
        paddingTop: 5,
        paddingHorizontal: 29,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5
        },
        shadowOpacity: 1.25,
        shadowRadius: 3.84,
        elevation: 20
      },
      modalText: {
        margin: 10,
        textAlign: "center",
        fontWeight: "bold",
        fontSize:17,
      },
      buttonClose: {
        backgroundColor: "#f754c8",
        width: 70,
        height: 37,
      }
});

export default IndexScreen;

