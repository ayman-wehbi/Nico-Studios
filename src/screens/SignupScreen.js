import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';


import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { auth, firestore } from '../../firebase'; // Adjust the path as necessary
import { useNavigation} from '@react-navigation/native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

const fetchFonts = () => {
    
    return Font.loadAsync({
      'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
      'Cursives': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
    });
  };
  

const SignupScreen = (props) => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const isFormValid = () => firstName && lastName && username && password;

    useEffect(() => {
      async function prepare() {
        try {
          await SplashScreen.preventAutoHideAsync();
          await fetchFonts();
          // Wait for other resources to load
        } catch (e) {
          console.warn(e);
        } finally {
          setFontLoaded(true);
          await SplashScreen.hideAsync();
        }
      }
  
      prepare();
    }, []);

    useEffect ( ( ) => {
        const unsubscribe = auth.onAuthStateChanged (user => {
        if (user) {
        navigation.navigate("Projects")
        }})
        return unsubscribe
        }, [])
    
        const ErrorModal = () => (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{errorMessage}</Text>
                <View style={styles.modalViewButtons}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                    android_ripple={{ color: 'black', borderless: false}}
                  >
                    <Text style={styles.textStyle}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        );

        const checkUsernameUnique = async (username) => {
          const q = query(collection(firestore, "users"), where("username", "==", username));
          const querySnapshot = await getDocs(q);
          return querySnapshot.empty; // returns true if no documents found, meaning username is unique
        };
      
        const handleSignUp = async () => {
          const isUnique = await checkUsernameUnique(username);
          if (!isUnique) {
            setErrorMessage('Username is already taken.');
            setModalVisible(true);
            return;
          }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
        
                console.log(firestore); // Add this line before setDoc to debug
                await setDoc(doc(firestore, "users", user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    email: email,
                });
                
        
                console.log("User profile created in Firestore");
                navigation.navigate("SongList");
            } catch (error) {
                console.error("Error during signup:", error);
                setErrorMessage('Invalid email or email already in use.');
                setModalVisible(true);
            }
        };

        const handleEmailChange = (text) => {
          setEmail(text);
          // Simple validation check (for example purposes)
          const isValid = text.includes('@') && text.includes('.');
          setIsEmailValid(isValid);
        };

    if (!fontLoaded) {
        return null;
    }


    return (
        
        <View style={styles.container}>
            <ErrorModal />
            
            <View style={styles.titleContainer}>
                <Text style={styles.title}>NICO STUDIOS</Text>
                <Text style={styles.subtitle}>for songwriters</Text>
            </View>
            <View style={styles.loginContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor={"grey"}
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor={"grey"}
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="username"
                    placeholderTextColor={"grey"}
                    value={username}
                    onChangeText={setUsername}
                    
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={"grey"}
                    value={email}
                    onChangeText={handleEmailChange}
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
                <Pressable style={[styles.button, {opacity: isFormValid ? 1 : 0.5}]} // Conditionally style the button
                          onPress={handleSignUp}
                          disabled={!isFormValid}
                          android_ripple={{ color: 'black', borderRadius: 5 }} // Conditionally disable the button
                >
                    <Text style={styles.buttonText} >Sign Up</Text>
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
        marginTop:"25%",
        alignItems: 'flex-end',
        marginBottom: "5 %"
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
        marginTop: 10,
    },
    buttonText: {
        color: '#121a39',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 30,
        backgroundColor: "#face88",
        borderRadius: 10,
        paddingTop: 3,
        paddingHorizontal: 30,
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
      modalViewButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // This spreads out your buttons evenly
      },
      modalText: {
        marginTop: 10,
        textAlign: "center",
        fontSize:17,
      },
      buttonClose: {
        backgroundColor: "rgba(247, 84, 200, 0.0)", // Corrected color value
        width: 100, // Adjusted width to accommodate text
        height: 40, // Adjusted for better touch area
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        borderRadius: 9, // Optional: adds rounded corners
        marginHorizontal: 5, // Optional: adds space between buttons
      },
      buttonPass: {
        backgroundColor: "rgba(247, 84, 200, 0.0)",
        width: 150, // Adjusted width to accommodate text
        height: 40, // Adjusted for better touch area
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        borderRadius: 9, // Optional: adds rounded corners
        marginHorizontal: 5, // Optional: adds space between buttons
      },

});

export default SignupScreen;

