import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable, Button} from 'react-native';
import {Context} from "../context/NoteContext"
import { AsyncStorage } from 'react-native';

const CreateScreen = (props) => {

  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState([]);
  const {addSong} = useContext(Context);

  useEffect(() => {
    const saveData = async () => {
      try {
        // Save the song data using AsyncStorage
        const songData = JSON.stringify(titles);
        await AsyncStorage.setItem('songData',songData);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }; saveData();
  }, [titles])

  const addFile = () => {
    if (title.trim() !== '') {
      // Generate a unique ID for the song
      const id = Date.now().toString();
      // Add the song to the titles state
      setTitles([...titles, { id, title }]);
      // Log the ID and title
      console.log(`Added Song - ID: ${id}, Title: ${title}`);
      setTitle('');
    }
  };
  

  return <View style={style.viewStyle}>

    <View style={style.buttons}>
        <Pressable style={style.cancel}>
          <Text style={style.textCancel} onPress={() => props.navigation.goBack()}>Cancel</Text>
        </Pressable>
       
        <Pressable title="Add" style={style.create} onPress={() => {addFile(title);
                                                                    addSong(title) ;
                                                                    props.navigation.navigate("SongList"); }}>
          <Text>Create</Text>
        </Pressable>       
    </View> 
    <Text>{"\n"}</Text>
    
    <TextInput  placeholder="Song name" placeholderTextColor={'grey'} style = {style.input} value={title} onChangeText={(text) => setTitle(text)}/>

    

  </View>
};

const style = StyleSheet.create({
  viewStyle: {
    
    flex: 1,
    backgroundColor: "#0f0f0f"
  },

  textLables:{
    fontSize: 18,
    
  },

  textGenre:{
    fontSize: 18,
    marginTop: 5
  },

  textDate:{
    fontSize: 18,
    marginLeft: 220,
    top: 158,
    marginTop: 5
  },

  inputGenre: {
    borderColor: 'black',
    borderBottomWidth: 5,
    width: 150,
    marginTop: 4,
    left: 4
  },

  cancel: {
    alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 2,
        marginLeft: 15,
  },

  create: {
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

  textCreate: {
    top: 10,
    fontSize: 18,
    borderWidth: 3,
    borderColor: 'black',
    alignSelf: 'flex-end',
    marginLeft: 247,
    right: 20
  },

  textCancel:{
    color: 'white'
  },

  input: {
    borderColor: 'white',
    borderBottomWidth :1,
    margin: 10,
    color: "white",
  },

  buttons: {
    flexDirection:'row',
  }

});

export default CreateScreen;