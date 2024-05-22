import React, { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from "../context/NoteContext";

//tHIS SCREEN IS NOT OF USE ANYMORE
//IT IS STORE FOR COMPONENT USE AND LEGACY

const CreateScreen = (props) => {
  // State variables
  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState([]);
  const { addSong } = useContext(Context);

  // useEffect to save data to AsyncStorage when 'titles' state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const songData = JSON.stringify(titles);
        await AsyncStorage.setItem('songData', songData);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [titles]);

  // Function to add a new song
  const addFile = async () => {
    if (title.trim() !== '') {
      const id = Date.now().toString();
      const newSong = { id, title };
      
      // Update state with the new song
      setTitles([...titles, newSong]);
      setTitle('');

      try {
        // Retrieve existing songs from AsyncStorage
        const storedSongs = await AsyncStorage.getItem('storedSongs');
        const existingSongs = storedSongs ? JSON.parse(storedSongs) : [];
        
        // Update the list of songs and save back to AsyncStorage
        const updatedSongs = [...existingSongs, newSong];
        await AsyncStorage.setItem('storedSongs', JSON.stringify(updatedSongs));
      } catch (error) {
        console.error('Error saving song to AsyncStorage:', error);
      }

      // Navigate to the SongScreen with the created song's ID
      props.navigation.navigate('SongScreen', { id });
    }
  };

  // Render component
  return (
    <View style={styles.container}>
      {/* Buttons for cancel and create */}
      <View style={styles.buttons}>
        <Pressable style={styles.cancelButton}>
          <Text style={styles.cancelButtonText} onPress={() => props.navigation.goBack()}>Cancel</Text>
        </Pressable>
        <Pressable title="Add" style={styles.createButton} onPress={addFile}>
          <Text>Create</Text>
        </Pressable>
      </View>
      <Text>{"\n"}</Text>
      {/* Input for song name */}
      <TextInput 
        placeholder="Song name" 
        placeholderTextColor={'grey'} 
        style={styles.input} 
        value={titles} 
        onChangeText={(text) => setTitle(text)} 
      />
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },

  buttons: {
    flexDirection: 'row',
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 2,
    marginLeft: 15,
  },

  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 2,
    borderRadius: 9,
    marginLeft: "58%",
    elevation: 3,
    width: 100,
    backgroundColor: '#FF45C9',
  },

  cancelButtonText: {
    color: 'white'
  },

  input: {
    borderColor: 'white',
    borderBottomWidth: 1,
    margin: 10,
    color: "white",
  },
});

export default CreateScreen;
