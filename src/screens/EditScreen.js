import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { Context } from '../context/NoteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

//CURRENTLY THIS PAGE IS UNUSED THE TITLE CAN BE EDITED FROM THE MAIN SCREEN NOW

const EditScreen = (props) => {
  const { state, write } = useContext(Context);
  const songFiles = props.navigation.getParam('id');

  // State to manage the song title and content
  const [songState, setSongState] = useState({
    title: '',
    content: '',
  });

  const [title, setTitle] = useState(songState.title);
  const [content, setContent] = useState(songState.content);

  // Load song data from AsyncStorage when component mounts
  useEffect(() => {
    const loadSong = async () => {
      try {
        const serializedData = await AsyncStorage.getItem(`song_${songFiles}`);
        if (serializedData) {
          const { title, content } = JSON.parse(serializedData);
          setSongState({ title, content });
          setTitle(title);
        }
      } catch (error) {
        console.error('Error loading song:', error);
      }
    };

    loadSong();
  }, [songFiles]);

  // Function to handle saving the edited title
  const handleSaveTitle = () => {
    try {
      // Save the edited title
      write(songFiles, title, content);
      // Navigate back to the SongScreen
      props.navigation.goBack();
      console.log(`Saved Title - ID:Title: ${title}`);
    } catch (error) {
      console.error('Error saving title:', error);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <TextInput
        placeholder="Title..."
        placeholderTextColor={'grey'}
        multiline
        style={styles.title}
        onChangeText={(newTitle) => setTitle(newTitle)}
        value={title}
      />

      <Pressable
        style={styles.saveButton}
        onPress={handleSaveTitle}
        android_ripple={{ color: '#face88' }}
      >
        <Text style={{ color: 'white' }}>Save Title</Text>
      </Pressable>
    </View>
  );
};

// Navigation options for the screen
EditScreen.navigationOptions = {
  title: 'Home', // Set the title of the header
};

export default EditScreen;

// Styles
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20,
  },
  title: {
    marginTop: 10,
    fontSize: 25,
    color: 'white',
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 9,
    elevation: 3,
    width: 150,
    height: 40,
    backgroundColor: '#FF45C9',
  },
});
