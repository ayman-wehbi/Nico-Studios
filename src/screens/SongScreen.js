import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Modal, FlatList, Keyboard,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Context } from '../context/NoteContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; 
import { getAuth } from 'firebase/auth';
import debounce from 'lodash/debounce';




const SongScreen = (props) => {
  // Context for handling state
  const { write, state } = useContext(Context);
  const [projects, setProjects] = useState([]);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isContentEditable, setIsContentEditable] = useState(false);

  // Get the song ID from navigation parameters
  const thisSong = props.route.params.id;
  const fullSong = {thisSong, title, content}
  
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Date.now() - startTime;
      // Save timeSpent to AsyncStorage or state
    };
  }, []);

  useEffect(() => {
    console.log("SongScreen mounted with song ID:", thisSong);  // Log the received song ID
  
    const loadContent = async () => {
      const loadedContent = await loadSong(thisSong);
      if (loadedContent) {
        setSongState({ title: loadedContent.title, content: loadedContent.content });
        setTitle(loadedContent.title);
        setContent(loadedContent.content);
        console.log("Fetched song data:", loadedContent);  // Log the loaded song data
      } else {
        console.log("No song data found for ID:", thisSong);  // Log if no data is found
      }
    };
  
    loadContent();
  }, [thisSong]);

  // State for song data
  const [songState, setSongState] = useState({
    title: '',
    content: '',
  });

  //feature disabled on this screen for the moment but will be used again soon
  const addSongToProject = async (songId, projectId) => { 
    try {
      // Fetch the project from AsyncStorage
      const projectData = await AsyncStorage.getItem(`project_${projectId}`);
      if (!projectData) {
        throw new Error('Project not found');
      }
      const project = JSON.parse(projectData);
  
      // Update the project's songs array
      const updatedSongs = [...project.songs, songId];
      const updatedProject = { ...project, songs: updatedSongs };
  
      // Save the updated project back to AsyncStorage
      await AsyncStorage.setItem(`project_${projectId}`, JSON.stringify(updatedProject));
  
      console.log('Song added to project successfully');
    } catch (error) {
      console.error('Error adding song to project:', error);
    }
  };

  
  // State variables for title, content, and title editing status
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);

  // Function to load song data from AsyncStorage
  const loadSong = async (id) => {
    try {
      // Try fetching from AsyncStorage first
      const serializedData = await AsyncStorage.getItem(`song_${id}`);
      if (serializedData) {
        const { title, content } = JSON.parse(serializedData);
        return { title, content };
      } else {
        // If not in AsyncStorage, fetch from Firestore
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const songDocRef = doc(firestore, 'users', user.uid, 'songs', id);
          const docSnapshot = await getDoc(songDocRef);
          if (docSnapshot.exists()) {
            console.log('Fetched song from Firestore:', docSnapshot.data());
            return { ...docSnapshot.data() };
          } else {
            console.log('Song not found in Firestore');
          }
        }
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

  const saveAndUpdateSong = async (updatedSong) => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(`song_${updatedSong.id}`, JSON.stringify(updatedSong));
      console.log('Song saved to AsyncStorage successfully!');

      // Reupload to Firestore
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      const songDocRef = doc(firestore, 'users', user.uid, 'songs', updatedSong.id);
      await setDoc(songDocRef, updatedSong); // This will overwrite the document in Firestore
      console.log('Song reuploaded to Firestore successfully!');
    } catch (error) {
      console.error('Error saving and reuploading song:', error);
    }
  };

  const debouncedSaveAndUpdateSong = debounce(saveAndUpdateSong, 500);

  // Function to save song when either the title or content is blurred
  const saveSongOnBlur = () => {
    const finalTitle = title.trim() === '' ? 'Untitled' : title.trimEnd();
    saveSong(thisSong, finalTitle, content);
  };

  //Load projects from asynch storage
  const loadProjectsFromAsyncStorage = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
  
      // Filter for project keys only
      const projectKeys = keys.filter((key) => key.startsWith('project_'));
  
      // Fetch project data
      const projectsData = await AsyncStorage.multiGet(projectKeys);
  
      // Parse and format project data
      const projects = projectsData.map(([key, value]) => JSON.parse(value));
  
      return projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      return []; // Return an empty array in case of error
    }
  };

  //call loadProjectsFromAsyncStorage when the component mounts and update the projects state.
  useEffect(() => {
    const load = async () => {
      const loadedProjects = await loadProjectsFromAsyncStorage();
      setProjects(loadedProjects);
    };
    load();
  }, []);

  // Function to start editing the title
  const startEditingTitle = () => {
    setEditingTitle(true);
  };

  // Function to stop editing the title
  const stopEditingTitle = () => {
    setEditingTitle(false);
    // Trim and save the updated title when editing is stopped
    saveSong(thisSong, title.trimEnd(), content);
  };

  // Effect to load song data when the component mounts or when the song ID changes
  useEffect(() => {
    const loadContent = async () => {
      const loadedContent = await loadSong(thisSong);
      if (loadedContent) {
        setSongState({ title: loadedContent.title, content: loadedContent.content });
        setTitle(loadedContent.title);
        setContent(loadedContent.content);
      }
    };
    loadContent();
  }, [thisSong]);

  // Effect to save song data when the component is blurred
  useEffect(() => {
    const saveOnBlur = props.navigation.addListener('blur', () => {
      saveSong(thisSong, title.trimEnd(), content);
    });

    return () => {
      saveOnBlur();
    };
  }, [props.navigation, thisSong, title, content]);

  // Function to handle title change
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    debouncedSaveAndUpdateSong({ id: thisSong, title: newTitle, content });
  };

  // Function to handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
    debouncedSaveAndUpdateSong({ id: thisSong, title, content: newContent });
  };

  const checkAndDeleteSong = async () => {
    if (title.trim() === '' && content.trim() === '') {
      try {
        await AsyncStorage.removeItem(`song_${thisSong}`);
        console.log('Empty song deleted successfully!');
      } catch (error) {
        console.error('Error deleting empty song:', error);
      }
    }
  };

  // Render component
  return (
    <View style={styles.contentContainer} overScrollMode="always">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
          {/* Input for editing the title */}
          <Pressable onPress={() => setIsTitleEditable(true)}>
          <TextInput
            placeholder="Title..."
            placeholderTextColor={'grey'}
            style={styles.title}
            value={title}
            onChangeText={handleTitleChange}
            onBlur={() => {
              saveSongOnBlur();
              setIsTitleEditable(false);
            }}
            onFocus={() => {
              startEditingTitle();
              setIsTitleEditable(true);
            }}
            editable={isTitleEditable}
            autoFocus={false}
          />
        </Pressable>

        </View>
        <ScrollView style={styles.fullScreen}>

        <TextInput
          placeholder="Lyrics..."
          placeholderTextColor={'grey'}
          multiline
          style={styles.input}
          onChangeText={handleContentChange}
          value={content}
        />
        </ScrollView>
      </SafeAreaView>
       
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: "white",
    alignSelf: 'stretch', 
    textAlign: 'left',    
    padding: 10, 
  },
  
  input: {
    flex: 1, 
    color: "white",
    fontSize: 16.25,
    textAlign: 'left',
    paddingVertical:0, 
    paddingHorizontal: 10,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },

  fullScreen: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
  },

  projectItemText:{
    color: "white",
  }
});

export default SongScreen;