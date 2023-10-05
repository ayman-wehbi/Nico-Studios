import React, { useContext } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Touchable} from 'react-native';
import { Context } from '../context/NoteContext';
import { SafeAreaView } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const EditScreen = (props) => {
    const {state, write} = useContext(Context)
    const songFiles = props.navigation.getParam("id");
    
    const songState = state.find((songState) => {
        return songFiles === songState.id;
    })

    console.log(songState);

    const [title, setTitle]= useState(songState.title);
    const [content]= useState(songState.content);

    const handleSaveTitle = () => {
        // Save the edited title
        write(songFiles, title, content);
        // Navigate back to the SongScreen
        props.navigation.goBack();
    };
    
    
    return (
        <View style={style.contentContainer}>
            <TextInput
                placeholder="Title..."
                placeholderTextColor={'grey'}
                multiline
                style={style.title}
                onChangeText={(newTitle) => setTitle(newTitle)}
                value={title}
            />
        
            <Pressable style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                marginTop: 2,
                                borderRadius: 9,
                                elevation: 3,
                                width: 100,
                                height: 40,
                                backgroundColor: '#FF45C9',
                        }}
            onPress={handleSaveTitle} android_ripple={{ color: '#face88' }}>
                <Text style={{color: 'white'}}>Save Title</Text>
            </Pressable>
            
        </View>
    );
};

EditScreen.navigationOptions = {
        title: 'Home', // Set the title of the header
        
      };
export default EditScreen;
const style = StyleSheet.create({
    title: {
        marginTop: 10,
        fontSize: 25,
        marginLeft: 20,
        color: "white"
    },
    input:{
        marginTop: 5,
        width: "92%",
        color: "white",
        borderRadius: 5,
        padding: 5,
        alignSelf: "center",
        fontSize: 40,
        height: "90%",
        textAlignVertical: "top",
    },
    contentContainer: {
        flex: 1, // pushes the footer to the end of the screen
        backgroundColor: "#0f0f0f"
    },

    edit:{
        margin: 5,
    },
    texts: {
        fontSize: 25,
        alignSelf: 'center',
        color:"white",
    },
    safeArea:{
        flexDirection: "row", // Make items appear in a row
        alignItems: "center", // Center items vertically
    
    saveButton: {
        backgroundColor: 'white',
        padding: 10,
        alignSelf: 'center',
        borderRadius: 5,
        color: 'white',
        },

    saveButtonText:{
        fontSize:26
    },
}})