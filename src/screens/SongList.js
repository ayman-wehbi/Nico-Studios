import { StyleSheet, Text, View, ScrollView,Alert, FlatList, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Navigation from '../components/Navigation';
import CardBig from '../components/SongCard';
import { Context as NoteContext } from '../context/NoteContext';
import { AsyncStorage } from 'react-native';

const SongList = (props) => {
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState([]);
  const [titles, setTitles] = useState([]);
 
  const addFile = async () => {
      // Generate a unique ID for the song
      const id = Date.now().toString();
      // Add the song to the titles state
      const newSong = { id, title };
      setTitles([...titles, newSong]);
      // Log the ID and title
      console.log(`Added Song - ID: ${id}, Title: ${title}`);
      setTitle('');

      // Save the new song to AsyncStorage
      try {
        const storedSongs = await AsyncStorage.getItem('storedSongs');
        const existingSongs = storedSongs ? JSON.parse(storedSongs) : [];
        const updatedSongs = [...existingSongs, newSong];
        await AsyncStorage.setItem('storedSongs', JSON.stringify(updatedSongs));
      } catch (error) {
        console.error('Error saving song to AsyncStorage:', error);
      }

      // Navigate to the SongScreen with the created song's ID
      props.navigation.navigate('SongScreen', { id });
  };

  const loadSongs = async () => {
    const allSongs = await getAllSongs();
    setSongs(allSongs);
  };

  useEffect(() => {
    loadSongs();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Use useFocusEffect to reload songs when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSongs();
    }, [])
  );

  const getAllSongs = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const songKeys = keys.filter((key) => key.startsWith('song_'));
      const songs = await AsyncStorage.multiGet(songKeys);
      return songs.map(([key, value]) => JSON.parse(value));
    } catch (error) {
      console.error('Error getting all songs:', error);
      return [];
    }
  };

  const deleteSongById = async (id) => {
    try {
      // Show a confirmation dialog before deleting
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this song?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: async () => {
              // Delete the song from AsyncStorage
              await AsyncStorage.removeItem(`song_${id}`);
              // Reload songs after deletion
              loadSongs();
            }
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.ScreenTitle}> Songs </Text>
        <FlatList
          data={songs}
          keyExtractor={(songFile) => songFile.id}
          renderItem={({ item }) => {
            return (
              
              <Pressable
                android_ripple={{ color: 'black' }}
                onPress={() => {
                  props.navigation.navigate('SongScreen', { id: item.id });; 
                }}
                onLongPress={() => deleteSongById(item.id)}
              >
                <CardBig>
                  <View>
                    <Text style={styles.titles}>{item.title}</Text>
                    <Text style={styles.footnote}>Project:      </Text>
                  </View>
                </CardBig>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
      <View>
        <Pressable
          style={styles.button}
          android_ripple={{ color: 'black' }}
          onPress={addFile}>
          <Text>Create</Text>
        </Pressable>
      </View>
      <Navigation Style={styles.navigation} navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
    RosterList:{
        fontSize: 20, 
    },
    titles:{
        color:"Black",
        fontSize: 25,
        marginLeft: 10,
    },
    footnote:{
        textAlign: "right",
        bottom: 1.5,
        right: 1.5,
        fontSize: 11,
    },
    character:{
        marginTop: 20,
        textAlign: 'center',
        fontSize: 25, 
    },
    ScreenTitle:{
        fontSize: 30,
        textAlign: 'center',
        marginTop: 6,
        color:  '#ffd9e3',
    },
    contentContainer: {
        flex: 1, // pushes the footer to the end of the screen
        backgroundColor: "#0f0f0f"
    },
    viewCards: {
        flexDirection:'row',
    },
    footer: {
        height: 300,
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
        position: 'absolute',
      },
      button2: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        elevation: 3,
        width: 150, 
        height: 100,
        backgroundColor: '#FF45C9',
      },
});

export default  SongList;