import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Navigation = ({ navigation, button2Style, button1Style }) => {
    return (
        <View style={styles.container}>
            <Pressable 
                style={[styles.button1, button1Style]}
                android_ripple={{ color: 'black', }}
                onPress={() => { navigation.navigate("Projects") }}
            >
                <MaterialCommunityIcons 
                    style={[styles.texts, button1Style]}
                    name="album"  
                />
            </Pressable>

            <Pressable 
                style={[styles.button2, button2Style]} // Apply the external style here
                android_ripple={{ color: 'black', }}
                onPress={() => { navigation.navigate("SongList") }}
            >
                <MaterialCommunityIcons 
                    style={[styles.texts, button2Style]} // Apply the external text style here
                    name="format-list-bulleted"  
                />
            </Pressable>
        </View>
    );
};

const styles=StyleSheet.create({
    button1: {
        width: "50%", 
        height: 50,
        backgroundColor: "#face88", // alternative #ecc062
        justifyContent: "center"
    },
    button2: {
        width: "50%", 
        height: 50,
        backgroundColor: "#face88", // alternative #ecc062
        justifyContent: "center"
    },
    texts: {
        fontSize: 25,
        alignSelf: 'center'
    },
    container:{
        flexDirection:'row',
        alignContent: 'center',
    },
});

export default Navigation;