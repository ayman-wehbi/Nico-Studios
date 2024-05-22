import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from "../context/NoteContext";
import CardCreate from '../components/CardCreate';

const CreateScreen = (props) => {
  // Render component
  return (
    <View style={styles.viewStyle}>
      <View style={styles.buttons}>
        {/* Navigate to CreateSongScreen when "Create Song" card is pressed */}
        <Pressable onPress={() => { props.navigation.navigate("CreateSongScreen") }}>
          <CardCreate>
            <Text style={styles.text}>Create Song</Text>
          </CardCreate>
        </Pressable>

        {/* Navigate to CreateProjectScreen when "Create Project" card is pressed */}
        <Pressable onPress={() => { props.navigation.navigate("CreateProjectScreen") }}>
          <CardCreate>
            <Text style={styles.text}>Create Project</Text>
          </CardCreate>
        </Pressable>
      </View>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },

  textLables: {
    fontSize: 18,
  },

  textGenre: {
    fontSize: 18,
    marginTop: 5
  },

  textDate: {
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
