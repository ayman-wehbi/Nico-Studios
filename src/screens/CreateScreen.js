import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable, Button} from 'react-native';
import {Context} from "../context/NoteContext"
import CardCreate from '../components/CardCreate';
import { AsyncStorage } from 'react-native';

const CreateScreen = (props) => {

  return <View style={style.viewStyle}>

    <View style={style.buttons}>
        <Pressable onPress={() => {props.navigation.navigate("CreateSongScreen")}}>
          <CardCreate >
            <Text style={style.text}>Create Song</Text>
          </CardCreate>
        </Pressable>
       
        <Pressable onPress={() => {props.navigation.navigate("CreateSongScreen")}}>
          <CardCreate>
          <Text style={style.text}>Create Project</Text>
          </CardCreate>
        </Pressable>       
    </View> 
    

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



  textCreate: {
    top: 10,
    fontSize: 18,
    borderWidth: 3,
    borderColor: 'black',
    alignSelf: 'flex-end',
    marginLeft: 247,
    right: 20
  },

  text: {
    fontSize: 50,
    alignSelf: 'center'
    
  }

});

export default CreateScreen;