import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Pressable, Modal } from 'react-native';
import { AsyncStorage } from 'react-native';
import CardBig from '../components/SongCard';
import Navigation from '../components/Navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableWithoutFeedback } from 'react-native';


const ProjectDetails = ({ route, navigation }) => {
  const { id: projectId } = route.params;
  const [currentProject, setCurrentProject] = useState(null);
  const [songs, setSongs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  // Fetch project and songs from AsyncStorage on component mount
  useEffect(() => {
    const fetchProjectAndSongs = async () => {
      try {
        // Fetch project
        const project = await AsyncStorage.getItem(`project_${projectId}`);
        if (project) {
          const projectData = JSON.parse(project);
          setCurrentProject(projectData);

          // Fetch songs
          const fetchedSongs = [];
          for (const songId of projectData.songs) {
            const song = await AsyncStorage.getItem(`song_${songId}`);
            if (song) {
              fetchedSongs.push(JSON.parse(song));
            }
          }
          setSongs(fetchedSongs);
        }
      } catch (error) {
        console.error('Error fetching project and songs from AsyncStorage:', error);
      }
    };

    fetchProjectAndSongs();
  }, [projectId]);

  // Function to show options for a selected song
  const showOptions = (songId) => {
    setSelectedSongId(songId);
    setCustomModalVisible(true);
  };

  const renderSeparator = () => {
    return <View style={styles.separatorList} />;
  };

  const removeSongFromProject = async (songId) => {
    // Update the local state for immediate UI response
    setSongs(songs.filter((song) => song.id !== songId));

    // Update the project in AsyncStorage
    if (currentProject && currentProject.songs) {
      const updatedSongs = currentProject.songs.filter((id) => id !== songId);
      const updatedProject = { ...currentProject, songs: updatedSongs };
      setCurrentProject(updatedProject);
      try {
        await AsyncStorage.setItem(`project_${projectId}`, JSON.stringify(updatedProject));
      } catch (error) {
        console.error('Error removing the song from the project:', error);
      }
    }
    setCustomModalVisible(false); // Close the modal
  };

  const renderCustomModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={customModalVisible}
      onRequestClose={() => setCustomModalVisible(!customModalVisible)}
    >
      <TouchableWithoutFeedback onPress={() => setCustomModalVisible(false)}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.customModalView}>
              {/* Remove from Project Button */}
              <TouchableOpacity
                style={styles.customModalButton}
                onPress={() => removeSongFromProject(selectedSongId)}
              >
                <MaterialCommunityIcons name="minus-circle-outline" size={17} color="black" />
                <Text style={styles.customModalButtonText}> Remove from Project</Text>
              </TouchableOpacity>
  
              <View style={styles.separator} />
  
              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.customModalButton}
                onPress={() => setCustomModalVisible(false)}
              >
                <MaterialCommunityIcons name="cancel" size={16} color="black" />
                <Text style={styles.customModalButtonText}> Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Pressable
          android_ripple={{ color: 'black' }}
          onPress={() => navigation.navigate('SongScreen', { id: item.id })}
          onLongPress={() => showOptions(item.id)}
        >
          <Text style={styles.titles}>{item.title}</Text>
        </Pressable>
      </View>
    );
  };
  
  if (!currentProject) {
    return <View style={styles.container}><Text>Project not found</Text></View>;
  }

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.projectTitle}>{currentProject?.name || 'Project'}</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator} // Added separator here
        ListEmptyComponent={<Pressable onPress={() => {navigation.navigate("SongList")}}><Text style={styles.emptyMessageText} >Tap here to add some songs from your song list</Text></Pressable>}
      />
      {renderCustomModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },
  emptyMessageText: {
    fontSize: 35, 
    color: "white",
    textAlign: 'center', 
    padding: 7,
    color: "rgba(255, 217, 227, 0.4)",
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#ffd9e3', 
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#FFFFFF',
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
  itemContainer: {
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customModalView: {
    margin: 10,
    backgroundColor: "#ffd9e3", 
    borderRadius: 12,
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
});

export default ProjectDetails;