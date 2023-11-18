import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { AsyncStorage } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Context } from '../context/NoteContext';

const SongScreen = (props) => {
  // Context for handling state
  const { write } = useContext(Context);

  // Get the song ID from navigation parameters
  const songFiles = props.route.params.id;

  // State for song data
  const [songState, setSongState] = useState({
    title: '',
    content: '',
  });

  // State variables for title, content, and title editing status
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(songState.content);
  const [editingTitle, setEditingTitle] = useState(false);

  // Function to load song data from AsyncStorage
  const loadSong = async (id) => {
    try {
      const serializedData = await AsyncStorage.getItem(`song_${id}`);
      if (serializedData) {
        const { title, content } = JSON.parse(serializedData);
        return { title, content };
      }
    } catch (error) {
      console.error('Error loading song:', error);
    }
  };

  // Function to save song data to AsyncStorage
  const saveSong = async (id, title, content) => {
    try {
      const songData = { id, title, content };
      const serializedData = JSON.stringify(songData);
      await AsyncStorage.setItem(`song_${id}`, serializedData);
      console.log('Song saved successfully!');
    } catch (error) {
      console.error('Error saving song:', error);
    }
  };

  // Function to save song when either the title or content is blurred
  const saveSongOnBlur = () => {
    saveSong(songFiles, title, content);
  };

  // Function to start editing the title
  const startEditingTitle = () => {
    setEditingTitle(true);
  };

  // Function to stop editing the title
  const stopEditingTitle = () => {
    setEditingTitle(false);
    // Save the updated title when editing is stopped
    saveSong(songFiles, title, content);
  };

  // Effect to load song data when the component mounts or when the song ID changes
  useEffect(() => {
    const loadContent = async () => {
      const loadedContent = await loadSong(songFiles);
      if (loadedContent) {
        setSongState({ title: loadedContent.title, content: loadedContent.content });
        setTitle(loadedContent.title);
        setContent(loadedContent.content);
      }
    };
    loadContent();
  }, [songFiles]);

  // Effect to save song data when the component is blurred
  useEffect(() => {
    const saveOnBlur = props.navigation.addListener('blur', () => {
      saveSong(songFiles, title, content);
    });

    return () => {
      saveOnBlur();
    };
  }, [props.navigation, songFiles, title, content]);

  // Function to handle title change
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    saveSong(songFiles, newTitle, content);
  };

  // Function to handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    saveSong(songFiles, title, newContent);
  };

  // Render component
  return (
    <View style={styles.contentContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
          {/* Input for editing the title */}
          <TextInput
            placeholder="Title..."
            style={styles.title}
            value={title}
            onChangeText={handleTitleChange}
            onBlur={saveSongOnBlur}
            onFocus={startEditingTitle}
            autoFocus
          />
        </View>

        {/* Input for editing the content */}
        <TextInput
          placeholder="Lyrics..."
          placeholderTextColor={'grey'}
          multiline
          style={styles.input}
          onChangeText={handleContentChange}
          value={content}
          onBlur={saveSongOnBlur}
          onFocus={stopEditingTitle}
        />
      </SafeAreaView>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: "white",
    alignSelf: 'flex-start',
  },
  input: {
    marginTop: 5,
    width: "92%",
    color: "white",
    borderRadius: 5,
    padding: 5,
    alignSelf: "center",
    fontSize: 16,
    height: "90%",
    textAlignVertical: "top",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },
  safeArea: {
    alignItems: "center",
  }
});

export default SongScreen;
