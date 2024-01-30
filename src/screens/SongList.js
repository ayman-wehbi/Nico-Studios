import {
  StyleSheet,
  Modal,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  RefreshControl,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useFocusEffect } from '@react-navigation/native';
import Navigation from '../components/Navigation';
import { StatusBar } from 'react-native';
import CardBig from '../components/SongCard';
import { Context as NoteContext } from '../context/NoteContext';
import { AsyncStorage } from 'react-native';
import { Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { firestore } from '../../firebase'; 
import { collection, writeBatch, doc, getDocs} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const SongList = (props) => {
  // Extract necessary props and context using destructuring
  const { navigation } = props;
  const { state, deleteSongById} = useContext(NoteContext);


  // Define component's state variables
  const [title, setTitle] = useState([]); // Initialize with an empty array
  const [songs, setSongs] = useState([]); 
  const [titles, setTitles] = useState([]);
  const [project, setProject] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [projectListModalVisible, setProjectListModalVisible] = useState(false);

  // Create animated values for search bar animation
  const searchWidth = useRef(new Animated.Value(0)).current;
  const searchOpacity = useRef(new Animated.Value(1)).current;

  const getStatusBarStyle = () => {
    if (projectListModalVisible) {
      // When any modal is visible, dim the status bar by setting a semi-transparent black background
      return { backgroundColor: "#4b3d29" };
    }
    // When no modal is visible, set the status bar to its default appearance
    return { backgroundColor: '#face88', barStyle: 'dark-content' };
  };

  // Initialize selected song and project IDs as null
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleUploadSongs = async () => {
    try {
      const allSongs = await getAllSongs(); // Fetch all songs
      await uploadSongsToFirestore(allSongs); // Upload songs to Firestore
    } catch (error) {
      console.error('Error during song upload:', error);
    }
  };

  // Fetch and load songs on component mount


  // Fetch and load songs when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchDataAndLoad = async () => {
        await loadSongs();
      };
    
      fetchDataAndLoad();
    }, [])
  );

  useEffect(() => {
    const load = async () => {
      const loadedProjects = await loadProjectsFromAsyncStorage();
      setProjects(loadedProjects);
    };
    load();
  }, []); 

  const uploadSongsToFirestore = async (songs) => {
    const auth = getAuth(); // Initialize Firebase Authentication
    const user = auth.currentUser; // Get the currently logged-in user

    if (!user) {
      console.error('No user logged in');
      return;
    }

    const userSongsCollectionRef = collection(firestore, 'users', user.uid, 'songs');
    const batch = writeBatch(firestore);

    songs.forEach(song => {
        // Use the song's ID as the document ID in Firestore
        const songDocRef = doc(userSongsCollectionRef, song.id);
        batch.set(songDocRef, song); // This will overwrite the song if it already exists
    });

    try {
        await batch.commit();
        console.log('Songs uploaded/updated in Firestore successfully!');
    } catch (error) {
        console.error('Error uploading/updating songs to Firestore:', error);
    }
  };


  // Function to fetch songs from Firestore and update AsyncStorage
  const fetchAndStoreUserSongs = async () => {
    try {
      const auth = getAuth(); 
      const user = auth.currentUser; 
  
      if (!user) {
        console.error('No user logged in');
        return;
      }
  
      const userSongsCollectionRef = collection(firestore, 'users', user.uid, 'songs');
      const querySnapshot = await getDocs(userSongsCollectionRef);
  
      const fetchedSongs = [];
      querySnapshot.forEach((doc) => {
        fetchedSongs.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched songs from Firestore:", fetchedSongs);  
  
      const storedSongsJSON = await AsyncStorage.getItem('storedSongs');
      const existingSongs = storedSongsJSON ? JSON.parse(storedSongsJSON) : [];
  
      // Filter out duplicates
      const newSongs = fetchedSongs.filter(fetchedSong => 
        !existingSongs.some(existingSong => existingSong.id === fetchedSong.id)
      );
  
      // Merge the new songs with the existing songs
      const combinedSongs = [...existingSongs, ...newSongs];
      

      
  
      await AsyncStorage.setItem('storedSongs', JSON.stringify(combinedSongs));
      setSongs(combinedSongs);
    } catch (error) {
      console.error('Error fetching and storing user songs:', error);
    }
  };
  

  console.log('Loaded projects after adding new one:', projects);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      loadUnifiedSongs(); // Load or reload your songs
      await loadProjectsFromAsyncStorage(); // Load or reload your projects
    } catch (error) {
      console.error('Error refreshing songs and projects:', error);
    } finally {
      setRefreshing(false); // Reset the refreshing state
    }
  }, []);
  
  // Function to clear the search input text and animate the search bar back to default state
  const clearTextInput = () => {
    setSearchQuery('');
    animateSearchBar(false);
  };

  // Function to filter songs based on the search query
  const filteredSongs = songs.filter(song => 
    typeof song.title === 'string' && song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to animate the search bar
  const animateSearchBar = (shouldExpand) => {
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: shouldExpand ? 380 : 40,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: shouldExpand ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (!shouldExpand) {
        setIsSearchMode(false);
      }
    });
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      props.navigation.navigate("LoginScreen")
      // Additional actions after logout (e.g., navigate to login screen)
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  // useLayoutEffect to dynamically update the header based on search state
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        isSearchMode ? (
          <Animated.View style={[styles.searchBar, { width: searchWidth }]}>
            <TextInput
              autoFocus
              style={styles.searchInput}
              placeholder="search songs..."
              placeholderTextColor={"grey"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchIconContainer} onPress={clearTextInput}>
              <MaterialCommunityIcons name="close" size={24} color={'white'} />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity style={styles.searchIconContainer} onPress={() => {
            setIsSearchMode(true);
            animateSearchBar(true);
          }}>
            <MaterialCommunityIcons name="magnify" size={24} />
          </TouchableOpacity>
        )
      ),
    });
  }, [navigation, isSearchMode, searchQuery, searchWidth]);

  // Function to add a new song
  const addFile = async () => {
    const id = Date.now().toString();
    const newSong = { id, title, project };
    setTitles([...titles, newSong]);
    setProject([...project, newSong]);
    console.log(`Added Song - ID: ${id}, Title: ${title}, project: ${project}`);
    setTitle('');

    try {
      const storedSongs = await AsyncStorage.getItem('storedSongs');
      const existingSongs = storedSongs ? JSON.parse(storedSongs) : [];
      const updatedSongs = [...existingSongs, newSong];
      await AsyncStorage.setItem('storedSongs', JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Error saving song to AsyncStorage:', error);
    }
    props.navigation.navigate('SongScreen', { id });
  };

  // Function to fetch all songs from AsyncStorage
  const getAllSongs = async () => {
    try {
      console.log("Getting all songs from both AsyncStorage and Firestore");
  
      // Fetch songs from AsyncStorage
      console.log("Fetching songs from AsyncStorage");
      const keys = await AsyncStorage.getAllKeys();
      const songKeys = keys.filter((key) => key.startsWith('song_'));
      const localSongs = await AsyncStorage.multiGet(songKeys);
      const localSongsFormatted = localSongs.map(([key, value]) => {
        return { id: key.replace('song_', ''), ...JSON.parse(value) };
      });
      console.log(`Found ${localSongsFormatted.length} songs in AsyncStorage`);
  
      // Fetch songs from Firestore
      console.log("Fetching songs from Firestore");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('No user logged in');
        throw new Error('No user logged in');
      }
  
      const userSongsCollectionRef = collection(firestore, 'users', user.uid, 'songs');
      const querySnapshot = await getDocs(userSongsCollectionRef);
  
      const firestoreSongs = [];
      querySnapshot.forEach((doc) => {
        firestoreSongs.push({ id: doc.id, ...doc.data() });
      });
      console.log(`Found ${firestoreSongs.length} songs in Firestore`);
      console.log("Songs from Firestore:", firestoreSongs);
  
      // Save Firestore songs to AsyncStorage
      for (const song of firestoreSongs) {
        const serializedData = JSON.stringify(song);
        await AsyncStorage.setItem(`song_${song.id}`, serializedData);
      }
  
      // Combine and remove duplicates
      console.log("Combining and deduplicating songs from AsyncStorage and Firestore");
      const combinedSongs = [...localSongsFormatted, ...firestoreSongs];
      const uniqueSongs = Object.values(combinedSongs.reduce((acc, current) => {
        acc[current.id] = current; // Firestore songs will overwrite local ones if IDs match
        return acc;
      }, {}));
      console.log(`Total unique songs after combining: ${uniqueSongs.length}`);
      console.log("Unique songs after combining:", uniqueSongs);
  
      return uniqueSongs;
    } catch (error) {
      console.error('Error getting all songs:', error);
      return [];
    }
  };
  
  

  const loadFetchedSongs = async () => {
    try {
      const storedSongsJSON = await AsyncStorage.getItem('userSongs');
      if (storedSongsJSON !== null) {
        const storedSongs = JSON.parse(storedSongsJSON);
        // Process the songs as per your requirement
        setSongs(storedSongs); // Update your state with the loaded songs
      } else {
        console.log('No stored songs found');
      }
    } catch (error) {
      console.error('Error loading fetched songs from AsyncStorage:', error);
    }
  };

  const getUnuploadedSongs = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const songKeys = keys.filter((key) => key.startsWith('song_'));
      const songs = await AsyncStorage.multiGet(songKeys);
      return songs.map(([key, value]) => {
        const songData = JSON.parse(value);
        if (songData.uploaded) {
          return null;
        }
        return { id: key.replace('song_', ''), ...songData };
      }).filter(song => song !== null);
    } catch (error) {
      console.error('Error getting unuploaded songs:', error);
      return [];
    }
  };

  // Function to load songs to be rendered through the state
  const loadSongs = async () => {
    try {
      const allSongs = await getAllSongs();
      let untitledCount = 0;
  
      // Function to get the next untitled label
      const getNextUntitled = () => {
        untitledCount += 1;
        return `Untitled ${String(untitledCount).padStart(2, '0')}`; // Formats as Untitled 01, Untitled 02, ...
      };
  
      // Rename untitled songs
      const renamedSongs = allSongs.map((song) => {
        if (!song.title || song.title.trim() === '') {
          return { ...song, title: getNextUntitled() }; // Rename to Untitled 01, Untitled 02, ...
        }
        return song;
      });
  
      const sortedSongs = renamedSongs.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        return titleA.localeCompare(titleB);
      });
      setSongs(sortedSongs);
    } catch (error) {
      console.error('Error loading and renaming songs:', error);
    }
  };

  // Function to handle the delete action
  const handleDelete = async (id) => {
    // Show confirmation alert or directly delete
    await AsyncStorage.removeItem(`song_${id}`);
    loadSongs(); 
  };

  // Function to show options when a song is long-pressed
  const showOptions = (id) => {
    setSelectedSongId(id); 
    setCustomModalVisible(true);
  };

  const addSongToProject = async (songId, projectId) => {
    try {
      // Fetch the project from AsyncStorage
      const projectData = await AsyncStorage.getItem(`project_${projectId}`);
      if (!projectData) {
        throw new Error('Project not found');
      }
      const project = JSON.parse(projectData);
      
      // Check if the song is already in the project
      if (project.songs.includes(songId)) {
        // If the song is already in the project, alert the user
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Duplicate Song',
          text2: 'This song is already in the project.',
        });
        return; // Exit the function early
      }
  
      // Update the project's songs array with the new song ID
      const updatedSongs = [...project.songs, songId];
      const updatedProject = { ...project, songs: updatedSongs };
    
      // Save the updated project back to AsyncStorage
      await AsyncStorage.setItem(`project_${projectId}`, JSON.stringify(updatedProject));
  
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Success',
        text2: 'Song added to the project successfully!',
      });
    } catch (error) {
      console.error('Error adding song to project:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'There was a problem adding the song to the project.',
      });
    }
  };
  
  

  const handleSelectProject = async (projectId) => {
    await addSongToProject(selectedSongId, projectId);
    const updatedProjects = await loadProjectsFromAsyncStorage();
    setProjects(updatedProjects);
    setProjectListModalVisible(false); // Close the project list modal
  };

  const openProjectSelectionModal = () => {
    setCustomModalVisible(false);
    setProjectListModalVisible(true); // Open project list modal
  };

  const loadProjectsFromAsyncStorage = async () => {
    try { 
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      console.log("All keys in AsyncStorage:", keys); // Debug: Log all keys
  
      // Filter for project keys only
      const projectKeys = keys.filter((key) => key.startsWith('project_'));
      console.log("Filtered project keys:", projectKeys); // Debug: Log project keys
  
      // Fetch project data
      const projectsData = await AsyncStorage.multiGet(projectKeys);
  
      // Parse and format project data
      const projects = projectsData.map(([key, value]) => {
        try {
          const parsedProject = JSON.parse(value);
          if (!parsedProject || typeof parsedProject !== 'object' || !parsedProject.id) {
            throw new Error("Invalid project format");
          }
          return parsedProject;
        } catch (parseError) {
          console.error(`Error parsing project data for key ${key}:`, parseError);
          return null; // Return null for invalid or unparsable projects
        }
      }).filter(Boolean); // Filter out any null entries due to parsing errors
  
      console.log("Loaded projects:", projects); // Debug: Log loaded projects
      return projects;
    } catch (error) {
      console.error('Error loading projects from AsyncStorage:', error);
      return []; // Return an empty array in case of error
    }
  };
  
  useEffect(() => {
    const load = async () => {
      const loadedProjects = await loadProjectsFromAsyncStorage();
      setProjects(loadedProjects);
    };
  
    load();
  }, []);

  // Render each item in the FlatList
  const renderItem = ({ item }) => {

    //Funtion for swipe right to delete
    const renderRightActions = (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      return (
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={{
            backgroundColor: 'red',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'flex-end',
            paddingRight: 20,
          }}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <MaterialCommunityIcons name="trash-can-outline" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
      );
    };
    
    return(
      <View>
        <Pressable
          android_ripple={{ color: 'black' }}
          onPress={() => props.navigation.navigate('SongScreen', { id: item.id })}
          onLongPress={() => showOptions(item.id)}
        >
          <View style={styles.itemContainer}>
            <Text style={styles.titles}>{item.title}</Text>
          </View>
        </Pressable>
        <View style={styles.separatorList} />
      </View>
    );  
  };

  const renderProjectSelectionModal = () => (
    <Modal
      visible={projectListModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setProjectListModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setProjectListModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.projectModalView}>
              <FlatList
                data={projects}
                keyExtractor={(project) => project.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.projectItem}
                    onPress={() => {
                      handleSelectProject(item.id);
                      Toast.show({
                        type: 'success',
                        position: 'bottom',
                        text1: 'Success',
                        text2: 'Song added to the project successfully!',
                      });
                    }}
                  >
                    <Text style={styles.projectItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleLogout}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.contentContainer}>
      <StatusBar backgroundColor={getStatusBarStyle().backgroundColor} />
      <SafeAreaView style={{ flex: 1 }}>
      {filteredSongs.length > 0 ? (
          // Render the list of songs if there are any
          <FlatList
            data={filteredSongs}
            keyExtractor={(songFile) => songFile.id}
            renderItem={renderItem}
            overScrollMode="always"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#0f0f0f" ]} // Customize the spinner color
                progressBackgroundColor="#FF45C9" 
              />
            }
          />
        ) : (
          // Display the message if the song list is empty
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>
              Nothing much to see here.{"\n"}Get to creating!
            </Text>
          </View>
        )}
        {renderProjectSelectionModal()}
      </SafeAreaView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={customModalVisible}
        onRequestClose={() => setCustomModalVisible(!customModalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.customModalView}>
            <TouchableOpacity
              style={styles.customModalButton}
              onPress={openProjectSelectionModal}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={17} color="black" />
              <Text style={styles.customModalButtonText}> Add to Project</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.customModalButton}
              onPress={() => {
                handleDelete(selectedSongId);
                setCustomModalVisible(false);
              }}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={17} color="black" />
              <Text style={styles.customModalButtonText}> Delete</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.customModalButton}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons name="cancel" size={16} color="black" />
              <Text style={styles.customModalButtonText}> Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View>
        <Pressable style={styles.button2} android_ripple={{ color: 'black' }} onPress={addFile} onLongPress={handleUploadSongs}>
          <MaterialCommunityIcons name="pencil" size={16} color="black" />
          <Text style={styles.createButtonText}> Create Song</Text>
        </Pressable>
      </View>

      <Navigation navigation={props.navigation} button2Style={{fontWeight: "bold", fontSize:30, }} />
    
    </View>
  );
};

const styles = StyleSheet.create({
  RosterList: {
    fontSize: 20,
  },
  titles: {
    color: "Black",
    fontSize: 25,
    marginLeft: 10,
  },
  footnote: {
    textAlign: "right",
    bottom: 1.5,
    right: 1.5,
    fontSize: 11,
  },
  character: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 25,
  },
  ScreenTitle: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 6,
    color: '#ffd9e3',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },
  viewCards: {
    flexDirection: 'row',
  },
  footer: {
    height: 300,
  },
  createButtonText:{
    fontWeight: "bold"
    
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginLeft: 220,
    bottom: 10,
    borderRadius: 12,
    elevation: 3,
    width: 150,
    backgroundColor: '#FF45C9',
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 11,
    elevation: 3,
    width: 120,
    height: 60,
    backgroundColor: '#f754c8', // old color '#FF45C9'
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  projectText: {
    paddingVertical: 10,
  },
  itemContainer: {
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  titles: {
    color: "#ffd9e3",
    fontSize: 23,
  },
  separatorList: {
    height: 0.75,
    width: '89%',
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  searchContainer: {
    padding: 10,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    borderRadius: 7,
    height: 40,
    marginRight: 1,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    color: "#ffd9e5",
    marginLeft: 10,
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 20,
  },
  searchIconContainer: {
    marginTop: 3,
    marginRight: 15
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModalView: {
    margin: 10,
    backgroundColor: "#ffd9e3", 
    borderRadius: 8,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customModalButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 15,
    marginVertical: 0, 
  },
  customModalText: {
    color: 'black',
    textAlign: 'center',
  },
  separator: {
    height: 0.5,
    width: 250,
    backgroundColor: 'black', 
    alignSelf: 'center',
  },
  projectModalView: {
    margin: 10,
    backgroundColor: "#ffd9e3", 
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
    height: 2,
    margin: 20, 
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%', 
    maxHeight: '60%', 
  },

  
  projectItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 15,
    marginVertical: 0, 
  },


  projectItemText: {
    color: '#333', 
    fontSize: 16,
  },
  emptyMessageContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 7,
  },
  emptyMessageText: {
    fontSize: 31, 
    color: "white",
    textAlign: 'center', 
    padding: 0,
    color: "rgba(255, 217, 227, 0.4)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: 'black', 
    textAlign: 'center',
  },
});

export default SongList;
