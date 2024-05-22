import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { Alert, Text, StyleSheet, View, Pressable, ScrollView, TextInput, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import { Context } from '../context/NoteContext';
import { useFocusEffect } from '@react-navigation/native';
import Navigation from '../components/Navigation';
import CardProject from '../components/CardProject';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firestore } from '../../firebase'; 
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const ProjectPage = (props) => {
  const { state, addProject, deleteProject, dispatch } = useContext(Context);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isInfoButtonModalVisible, setIsInfoButtonModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editedProjectTitle, setEditedProjectTitle] = useState('');
  const navigation = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    await renderProjects();
    handleUploadProjects();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const syncProjects = async () => {
        const firestoreProjects = await fetchProjectsFromFirestore();
        const localProjects = await getLocalProjects(); // Assume this function fetches projects from AsyncStorage
        const mergedProjects = mergeAndDeduplicateProjects(localProjects, firestoreProjects);
        await saveProjects(mergedProjects); // Save the merged list back to AsyncStorage
        setSavedProjects(mergedProjects); // Update state to re-render UI
        await handleUploadProjects();
      };
  
      syncProjects();
    }, [])
  );
  

  const getStatusBarStyle = () => {
    if (isModalVisible || isInfoModalVisible || isInfoButtonModalVisible) {
      // When any modal is visible, dim the status bar by setting a semi-transparent black background
      return { backgroundColor: '#4b3d29' };
    }
    // When no modal is visible, set the status bar to its default appearance
    return { backgroundColor: '#face88', barStyle: 'dark-content' };
  };
  
  const renderProjects = () => {
  
    if (savedProjects.length === 0) {
      return <View style={styles.emptyMessageContainer}><Text style={styles.emptyMessageText}>Create Some Projects to Organize Your Work!</Text></View>;
    }
  
    return savedProjects.map((project) => (
      <CardProject
        key={project.id.toString()}
        title={project.name}
        onPress={() => props.navigation.navigate('ProjectDetails', { id: project.id })}
        onDelete={() => handleDeleteProject(project.id)}
        onInfoPress={() => showInfoModal(project)}
      />
    ));
  };
  
  const saveProjects = async (projects) => {
    try {
      // Parallelize AsyncStorage.setItem calls using Promise.all
      await Promise.all(
        projects.map(async (project) => {
          const key = `project_${project.id}`;
          console.log("Attempting to save project:", project);
          await AsyncStorage.setItem(key, JSON.stringify({ id: project.id, name: project.name, createdDate: project.createdDate,  songs: project.songs || [] }));


           const readBack = await AsyncStorage.getItem(key);
           console.log("Read back project:", JSON.parse(readBack));
        })
      );
  
      // Use a single AsyncStorage.multiGet to fetch all updated project data
      const updatedProjectsData = await AsyncStorage.multiGet(projects.map((project) => `project_${project.id}`));
  
      // Parse and format the updated project data
      const updatedProjects = updatedProjectsData.map(([key, value]) => {
        const projectObject = JSON.parse(value);
        const projectId = key.replace('project_', '');
        return { id: projectId, ...projectObject };
      });
  
      // Update the state with the updated projects
      setSavedProjects(updatedProjects);
      //console.log('SAVED projects:', updatedProjects);
    } catch (error) {
      //console.error('Error saving projects:', error);
    }
  };

  const fetchProjectsFromFirestore = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error('No user logged in');
      return [];
    }
  
    const userProjectsCollectionRef = collection(firestore, 'users', user.uid, 'projects');
    const querySnapshot = await getDocs(userProjectsCollectionRef);
  
    const firestoreProjects = [];
    querySnapshot.forEach((doc) => {
      firestoreProjects.push({ id: doc.id, ...doc.data() });
    });
  
    return firestoreProjects;
  };

  const uploadProjectsToFirestore = async (projects) => {
    const auth = getAuth(); // Initialize Firebase Authentication
    const user = auth.currentUser; // Get the currently logged-in user

    if (!user) {
      console.error('No user logged in');
      return;
    }

    // Reference to the user-specific 'songs' collection
    const userProjectsCollectionRef = collection(firestore, 'users', user.uid, 'projects');

    // Create a new write batch
    const batch = writeBatch(firestore);

    projects.forEach(project => {
      // Convert project ID to string if it's not already
      const projectId = String(project.id);
      const projectDocRef = doc(userProjectsCollectionRef, projectId);
      batch.set(projectDocRef, project);
  });

    try {
        // Commit the batch
        await batch.commit();
        console.log('Songs uploaded to Firestore successfully!');
    } catch (error) {
        console.error('Error uploading songs to Firestore:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {/* Existing buttons or components */}
          <TouchableOpacity onPress={handleSettingsNav} style={styles.infobuttonContainer}>
            <MaterialCommunityIcons name="cog" size={26} color="#0f0f0f" style={styles.infoButton}/>
          </TouchableOpacity>
        </>
      ),
    });
  }, [navigation, setIsInfoButtonModalVisible]);
  
  useEffect(() => {
    if (state.projects !== savedProjects) {
      setSavedProjects(state.projects);
    }
  }, [state.projects]);

  useEffect(() => {
    const saveProjectsToAsyncStorage = async () => {
      try {
        await saveProjects(state.projects);
        await loadAndRenderProjects(); 
      } catch (error) {
        console.error('Error saving projects to AsyncStorage:', error);
      }
    };
  
    if (state.projects.length > 0) {
      saveProjectsToAsyncStorage();
    }
  }, [state.projects]); // This useEffect runs every time the projects in state change
 
  const loadAndRenderProjectss = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
  
      // Filter for project keys only
      const projectKeys = keys.filter((key) => key.startsWith('project_'));
  
      // Fetch project data
      const projectData = await AsyncStorage.multiGet(projectKeys);
  
      // Parse and format project data
      const parsedProjects = projectData.map(([key, value]) => {
        const projectObject = JSON.parse(value);
        const projectId = key.replace('project_', '');
        return { id: projectId, ...projectObject };
      });
  
      //console.log('ArraySize', parsedProjects.length);
      //console.log('loadAndRenderProjects CALLED');
      console.log('Parsed Projects:', parsedProjects);
      parsedProjects.sort((a, b) => a.name.localeCompare(b.name));
  
      // Update state with parsed projects
      setSavedProjects(parsedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadAndRenderProjects = async () => {
    try {
      const [localProjects, firestoreProjects] = await Promise.all([getLocalProjects(), fetchProjectsFromFirestore()]);
      const mergedProjects = mergeAndDeduplicateProjects(localProjects, firestoreProjects);
  
      // Save the merged projects back to AsyncStorage
      await saveProjects(mergedProjects); // Assumes this function updates AsyncStorage with the merged list
  
      // Update the state with the merged projects to re-render the UI
      setSavedProjects(mergedProjects);
    } catch (error) {
      console.error('Error loading and rendering projects:', error);
    }
  };

  const getLocalProjects = async () => {
    // Get all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const projectKeys = keys.filter(key => key.startsWith('project_'));
    const projectData = await AsyncStorage.multiGet(projectKeys);
  
    return projectData.map(([key, value]) => JSON.parse(value));
  };

  const mergeAndDeduplicateProjects = (localProjects, firestoreProjects) => {
    const projectMap = {};
  
    // Add or update projects from local storage
    localProjects.forEach(project => {
      projectMap[project.id] = project;
    });
  
    // Add or update projects from Firestore, preferring the more recent version
    firestoreProjects.forEach(firestoreProject => {
      const localProject = projectMap[firestoreProject.id];
      if (!localProject || new Date(firestoreProject.lastUpdated) > new Date(localProject.lastUpdated)) {
        projectMap[firestoreProject.id] = firestoreProject;
      }
    });
  
    return Object.values(projectMap);
  };
  
  const handleSettingsNav = async () => {
      props.navigation.navigate("Settings")


  };

  const handleUploadProjects = async () => {
    try {
      // Fetch all projects
      const allProjects = await getAllProjects(); 
      await uploadProjectsToFirestore(allProjects); // Upload projects to Firestore
      console.log('Porjects uploaded')
    } catch (error) {
      console.error('Error during project upload:', error);
    }
  };
  
  const getAllProjects = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
  
      // Filter for project keys only
      const projectKeys = keys.filter((key) => key.startsWith('project_'));
  
      // Fetch project data
      const projectData = await AsyncStorage.multiGet(projectKeys);
  
      // Parse and format project data, excluding already uploaded projects
      const projects = projectData.map(([key, value]) => {
        const projectObject = JSON.parse(value);
        if (projectObject.uploaded) {
          // Skip this project if it's already uploaded
          return null;
        }
        const projectId = key.replace('project_', '');
        return { id: projectId, ...projectObject };
      }).filter(project => project !== null); // Remove null entries
  
      return projects;
    } catch (error) {
      console.error('Error getting all projects:', error);
      return [];
    }
  };
  
  
  // Call loadAndRenderProjects on component mount
  useEffect(() => {
      loadAndRenderProjects();
    console.log('ArraySize', savedProjects.length);

  }, []);
  
    useFocusEffect(
    React.useCallback(() => {
      loadAndRenderProjects();
    }, [])
  );
  
  const handleCreateProject = () => {
    if (newProjectTitle) {
      const createdDate = new Date().toLocaleDateString("en-US");

      addProject(newProjectTitle, createdDate);
      setNewProjectTitle(''); // Clear the input field
      setIsModalVisible(false); // Close the modal
    }
  };
  
  const handleDeleteProject = async (projectId) => {
    try {
      const key = `project_${projectId}`;
      await AsyncStorage.removeItem(key);  // Remove from AsyncStorage
      console.log('Project deleted:', projectId);
  
      // Filter out the deleted project from the savedProjects state
      const updatedProjects = savedProjects.filter(project => project.id !== projectId);
      setSavedProjects(updatedProjects);  // Update the state to re-render the UI
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };
  
  const showInfoModal = (project) => {
    setSelectedProject(project);
    setEditedProjectTitle(project.name);
    setIsInfoModalVisible(true);
  };
  
  const closeInfoModal = () => {
    setIsInfoModalVisible(false);
  };

  const restartApp = () => {
    RNRestart.Restart();
  };

  return (
    <View style={styles.contentContainer}>
       <StatusBar backgroundColor={getStatusBarStyle().backgroundColor} />

      <ScrollView
        contentContainerStyle={savedProjects.length === 0 ? styles.scrollViewEmpty : {}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0f0f0f"]} progressBackgroundColor="#FF45C9" />}
      >
        {renderProjects()}
      </ScrollView>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}
          >
            <View style={styles.overlay} />
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Project Title"
                  value={newProjectTitle}
                  onChangeText={setNewProjectTitle}
                />
                <View style={styles.separator} />
                <Pressable
                  style={styles.buttonCreateModal}
                  android_ripple={{ color: 'black' }}
                  onPress={() => {
                    handleCreateProject();
                  }}
                >
                  <Text style={styles.textStyle}>Create Project</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isInfoModalVisible}
            onRequestClose={closeInfoModal}
            
          >
            <View style={styles.centeredView}>
              <View style={styles.modalViewInfo}>
              <Text style={styles.projectTitle}>{selectedProject?.name}</Text>

          {/* Separator View */}
          <View style={styles.separator} />

                <Text>Created {selectedProject?.createdDate}</Text>
                <Text>{selectedProject?.songs.length} Song(s)</Text>

              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isInfoButtonModalVisible}
            onRequestClose={() => {
              setIsInfoButtonModalVisible(!isInfoButtonModalVisible);
            }}
          >  
            <View style={styles.overlay} />
            <View style={styles.centeredView}>
              <View style={styles.modalViewInfoBar}>
                <Text style={styles.modalTitle}>Adding Songs to Projects</Text>
                <View style={styles.separator} />
                <Text style={styles.modalText}>Apologies for the inconvenience. Please restart the application after creating a new project to add songs to said project.</Text>
                <View style={styles.separator} />
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]} 
                    onPress={() => setIsInfoButtonModalVisible(false)}
                  >
                    <Text style={styles.infoModalText}>Okay</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          <Pressable
            style={styles.createButton}
            onPress={() => setIsModalVisible(true)}
            onLongPress={handleUploadProjects}
            android_ripple={{ color: 'black' }}
          >
            <MaterialCommunityIcons name="layers" size={16} color="black" />
            <Text style={styles.createButtonText}> Create Project</Text>
          </Pressable>
        </View>
      <Navigation navigation={props.navigation} button1Style={{fontWeight: "bold", fontSize:30, }} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    color: 'white',
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginLeft: 200,
    bottom: -30,
    borderRadius: 12,
    elevation: 3,
    width: 150,
    backgroundColor: '#FF45C3',
    position: 'absolute',
  },
  createButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 11,
    elevation: 3,
    width: 120,
    height: 60,
    backgroundColor: '#f754c8',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  createButtonText:{
    fontWeight:"bold",

  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 6,
    color: '#ffd9e3',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "#ffd9e3",
    borderRadius: 7,
    paddingTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewInfo: {
    backgroundColor: "#ffd9e5",
    borderRadius: 8,
    width: "65%",
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 110,
  },
  modalInput: {
    height: 25,
    borderColor: 'black',
    borderBottomWidth: 1,  
    width: 230,  
    marginBottom: 20,
    marginTop: 10,
    color: 'black',  
    paddingLeft: 4, 
  },
  buttonClose: {
    backgroundColor: "#ffd9e3",
    padding: 10,
    paddingHorizontal: 90,
    width: '100%', 
    borderRadius: 8, 
  },
  infoModalText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal:5,
  },
  separator: {
    height: 0.4, 
    backgroundColor: '#000000', 
    width: 290,  
    alignSelf: 'center', 
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  emptyMessageContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 7,
  },
  emptyMessageText: {
    fontSize: 30, 
    color: "white",
    textAlign: 'center', 
    padding: 7,
    color: "rgba(255, 217, 227, 0.4)",
  },
  scrollViewEmpty: {
    flex: 1,
  },

  button: {
    borderRadius: 20,
    flex: 1, 
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 5,
    margin:5,
  },
  modalTitle:{
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  infobuttonContainer:{
    marginRight: 15,
  },
  modalViewInfoBar: {
    backgroundColor: "#ffd9e3",
    borderRadius: 7,
    paddingTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    width: "80%",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  buttonCreateModal:{
    width: "100%",
    padding:10,
  },
  textStyle:{
    width:"100%",
    marginHorizontal: "29%",
  }
});

export default ProjectPage;