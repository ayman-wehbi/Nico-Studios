import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import CardBig from '../components/SongCard';
import { Context as NoteContext } from '../context/NoteContext';
import { AsyncStorage } from 'react-native';

const SongList = (props) => {
  const { state, deleteSong } = useContext(NoteContext);
  const [savedSongs, setSavedSongs] = useState([]);

  // Function to fetch saved songs from AsyncStorage
  const fetchSavedSongs = async () => {
    try {

      const savedSongsJson = await AsyncStorage.getItem('songData');
      if (savedSongsJson) {
        const savedSongsArray = JSON.parse(savedSongsJson);
        setSavedSongs(savedSongsArray);
      }
    } catch (error) {
      console.error('Error fetching saved songs:', error);
    }
  };

  // Fetch saved songs when the component mounts
  useEffect(() => {
    fetchSavedSongs();
  }, []);

  const handleDelete = (id) => {
    // Call the deleteSong function from your context to remove the song by ID
    deleteSong(id);
  };
  

  

  return (
    <View style={styles.contentContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.ScreenTitle}> Songs </Text>
        <FlatList
          data={state.slice().reverse()}
          keyExtractor={(songFile) => songFile.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                android_ripple={{ color: 'black' }}
                onPress={() => {
                  props.navigation.navigate('SongScreen', { id: item.id });
;
                }}
                onLongPress={() => handleDelete(item.id)}
                >
                <CardBig>
                  <View>
                    <Text style={styles.titles}>{item.title}</Text>
                    <Text style={styles.footnote}>Project </Text>
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
          onPress={() => {
            props.navigation.navigate('CreateSongScreen');
;
          }}>
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