import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { useNavigation} from '@react-navigation/native'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; 

const fetchFonts = () => {
    
    return Font.loadAsync({
      'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
      'Cursives': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
    });
  };
  
const SettingsScreen = (props) => {
    const [firstName, setFirstName] = useState('');
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
              const userRef = doc(firestore, "users", user.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                  setFirstName(userSnap.data().firstName); 
              } else {
                  console.log("No such document!");
              }
          } else {
              // User is signed out
              navigation.navigate("LoginScreen");
          }
      });

      return unsubscribe; // Unsubscribe on cleanup
  }, [navigation]);
    
    const handleLogout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
      });
        // Additional actions after logout (e.g., navigate to login screen)
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    
    if (!firstName) {
      return null;
  }
    

    return (
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Hi, {firstName} </Text>
          </View>
          <Pressable style={styles.button} onPress={() => {props.navigation.navigate("AccountScreen")}}>
              <Text style={styles.buttonText}>Account</Text>
          </Pressable>

          <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
          <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={handleLogout}>
              <Text style={styles.buttonText}>About App</Text>
          </Pressable>
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
        flexDirection: "row"
    },
    title: {
        fontSize: 45,
        color: '#Face88',
        fontFamily: "Lemon",
    },
    subtitle: {
        fontSize: 45,
        color: '#f754c8',
        marginLeft: 5,
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
        justifyContent: 'flex-end',
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
      modalViewButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // This spreads out your buttons evenly
        marginTop: 5, // Gives some space between the text and the buttons
      },
      modalText: {
        margin: 10,
        textAlign: "center",
        fontSize:17,
      },
      buttonClose: {
        backgroundColor: "rgba(247, 84, 200, 0.7)", // Corrected color value
        width: 70, // Adjusted width to accommodate text
        height: 40, // Adjusted for better touch area
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        borderRadius: 9, // Optional: adds rounded corners
        marginHorizontal: 5, // Optional: adds space between buttons
      },
      buttonPass: {
        backgroundColor: "rgba(247, 84, 200, 0.7)",
        width: 150, // Adjusted width to accommodate text
        height: 40, // Adjusted for better touch area
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        borderRadius: 9, // Optional: adds rounded corners
        marginHorizontal: 5, // Optional: adds space between buttons
      },

});

export default SettingsScreen;

