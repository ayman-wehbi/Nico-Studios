import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Navigation = (props) => {
    return <View style={styles.container}>

        <Pressable style={styles.button} android_ripple={{ color: 'black', }}onPress={() => {props.navigation.navigate("Projects")}}>
            <MaterialCommunityIcons style={styles.texts}name="album"  />
        </Pressable>

        <Pressable style={styles.button} android_ripple={{ color: 'black', }}onPress={() => {props.navigation.navigate("SongList")}}>
            <MaterialCommunityIcons style={styles.texts}name="format-list-bulleted"  />
        </Pressable>

    </View>
}

const styles=StyleSheet.create({
    button: {
        width: 200, 
        height: 55,
        backgroundColor: "#face88", 
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