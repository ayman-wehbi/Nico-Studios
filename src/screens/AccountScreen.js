import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Alert, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from '../../firebase'; // Adjust the path as necessary
import { useNavigation} from '@react-navigation/native'
import { firestore } from '../../firebase'; 
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, deleteUser, signOut } from 'firebase/auth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

const fetchFonts = () => {
    return Font.loadAsync({
      'Lemon': require('../assets/fonts/Lemon-Regular.ttf'),
      'Cursives': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
    });
  };
  
const AccountScreen = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [passwordForDelete, setPasswordForDelete] = useState('');
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);

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
                  setLastName(userSnap.data().lastName);
                  setUsername(userSnap.data().username);
                  setEmail(userSnap.data().email); 
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

  const showDeleteConfirmation = () => {
    setConfirmDeleteVisible(true);
};
    
  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, passwordForDelete);

    // Re-authenticate user
    try {
        await reauthenticateWithCredential(user, credential);
        // Delete user document from Firestore
        await deleteDoc(doc(firestore, "users", user.uid));
        // Delete user account
        await deleteUser(user);
        await AsyncStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
        console.error('Error deleting account:', error);
        Alert.alert("Error", "Failed to delete account. Please check your password and try again.");
        setPasswordModalVisible(false); // Hide password prompt modal
    }
};

// Function to show password prompt modal
const showPasswordPrompt = () => {
    setConfirmDeleteVisible(false); // Hide confirmation modal
    setPasswordModalVisible(true); // Show password prompt modal
};

    

    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>username: {username}</Text>
        <Text style={styles.subtitle}>Name: {firstName} {lastName}</Text>
        <Text style={styles.subtitle}>email: {email}</Text>
        <Pressable style={styles.button} android_ripple={{ color: 'black' }} onPress={() => navigation.navigate("PwResetScreen")}>
                    <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>
        <Pressable android_ripple={{ color: 'black' }} onPress={showDeleteConfirmation}>
                    <Text style={styles.deleteaccount} >Delete Account</Text>
        </Pressable>

                    {/* Confirm Deletion Modal */}
                    <Modal visible={confirmDeleteVisible} transparent={true}>
                    <View style={styles.modalView}>
                    <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
                    <View style={styles.modalViewButtons}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setConfirmDeleteVisible(false)}
                        android_ripple={{ color: 'black' }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonPass]}
                        onPress={showPasswordPrompt}
                        android_ripple={{ color: 'black' }}
                      >
                        <Text style={styles.textStyle}>Yes, Delete</Text>
                      </Pressable>
                  </View>
                </View>
            </Modal>

            {/* Password Prompt Modal */}
            <Modal visible={passwordModalVisible} transparent={true}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Enter your password to confirm:</Text>
                    <TextInput
                        secureTextEntry
                        value={passwordForDelete}
                        onChangeText={setPasswordForDelete}
                        placeholder="Password"
                        style={styles.input}
                    />
                    <View style={styles.modalViewButtons}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setPasswordModalVisible(false)}
                        android_ripple={{ color: 'black' }}
                      >
                        <Text style={styles.textStyle}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonPass]}
                        onPress={handleDeleteAccount}
                        android_ripple={{ color: 'black' }}
                      >
                        <Text style={styles.textStyle}>Delete Account</Text>
                      </Pressable>
                  </View>
                </View>
            </Modal>
        
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft:"2%",
        paddingTop: "5%",
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
        fontSize: 18,
        color: 'white',
        marginLeft: 5,
        marginBottom:5,
    },
    deleteaccount: {
      fontSize: 15,
      color: '#face88',
      marginBottom:5,
      alignSelf: "center",
  },
    loginContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        height: 40,

        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: "white",
    },
    button: {
        backgroundColor: '#FACE88',
        padding: 10,
        borderRadius: 9,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
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
        marginVertical:"75%",
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
        backgroundColor: "rgba(247, 84, 200, 0.0)", // Corrected color value
        width: 70, // Adjusted width to accommodate text
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

export default AccountScreen;

