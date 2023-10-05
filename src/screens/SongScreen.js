import React, { useContext } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Context } from '../context/NoteContext';
import { SafeAreaView } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SongScreen = (props) => {
  const { state, write } = useContext(Context);
  const songFiles = props.navigation.getParam("id");

  const songState = state.find((songState) => {
    return songFiles === songState.id;
  });

  console.log(songState);

  const title = songState.title;
  const [content] = useState(songState.content);

  const handleEditTitle = () => {
    // Navigate to the EditScreen with the song file ID
    props.navigation.navigate("EditScreen", { id: songFiles, title: title });
  };

  return (
    <View style={style.contentContainer}>
      <SafeAreaView style={style.safeArea}>
        <View style={style.titleContainer}>
          <TouchableOpacity onPress={handleEditTitle}>
            <Text style={style.title}>
              {title}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Lyrics..."
          placeholderTextColor={'grey'}
          multiline
          style={style.input}
          onChangeText={(content) => { write(songFiles, title, content) }}
          value={songState.content}
        />
      </SafeAreaView>
    </View>
  );
};

export default SongScreen;

const style = StyleSheet.create({
  
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
  pencilIcon: {
    fontSize: 25,
    color: "#face88",
    marginRight: -40,
  },
  safeArea: {
    alignItems: "center",
  }
});
