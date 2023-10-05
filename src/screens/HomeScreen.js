import { StyleSheet, Text, View, ScrollView, Button, FlatList, TouchableOpacity, Pressable } from 'react-native';
import React, {useContext,useState, useEffect} from 'react';
import Navigation from '../components/Navigation';
import Card from '../components/Card';
import CardBig from '../components/CardBig';
import { AsyncStorage } from 'react-native';
import {Context as NoteContext, setRecentlyEdited} from '../context/NoteContext';


const HomeScreen = (props) =>{

    const { state } = useContext(NoteContext);
    const [tasks, setTasks] = useState([]);
    const [recentTitle, setRecentTitle] = useState("No recent song created");
    const [recentTitle2, setRecentTitle2] = useState("No recent song created");


    const handleNavigateToRecentSong = () => {
        // Check if there are songs in the state
        if (state.length > 0) {
            const sortedState = [...state].reverse();
            const recent = sortedState[0];
          // Navigate to the first song in the list
          props.navigation.navigate('SongScreen', { id: recent.id });
        }
      };;

      const handleNavigateToRecentSong2 = () => {
        // Check if there are songs in the state
        if (state.length > 1) {
            const sortedState = [...state].reverse();
            const recent = sortedState[1];
          // Navigate to the first song in the list
          props.navigation.navigate('SongScreen', { id: recent.id });
        }
      };;

      useEffect(() => {
        // Check if there are songs in the state
        if (state.length > 0) {
          // Sort the state array by date in descending order
          const sortedState = [...state].reverse();
          // Get the title of the most recent song (the first one after sorting)
          const mostRecentSong = sortedState[0];
          setRecentTitle(mostRecentSong.title);
        } else {
          setRecentTitle("No recent song created");
        }
      }, [state]);

      useEffect(() => {
        // Check if there are songs in the state
        if (state.length > 1) {
          // Get the title of the most recent song
          const sortedState = [...state].reverse();
          const mostRecentSong = sortedState[1];
          setRecentTitle2(mostRecentSong.title);
        } else {
          setRecentTitle2("No recent song created");
        }
      }, [state]);
    
    return(
        <View style={styles.contentContainer}>
            <ScrollView>
                <Text style={styles.ScreenTitle}> Nico Studios </Text>

                <View style={styles.viewCards}>
                    <Pressable android_ripple={{ color: 'black', }} >
                        <Card>
                            <Text> Pinned Song </Text>
                        </Card>
                    </Pressable>

                    <Pressable android_ripple={{ color: 'black', }} >
                        <Card>
                            <Text> Pinned project</Text>
                        </Card>
                    </Pressable>
                </View>
                
                <Pressable android_ripple={{ color: 'black', }}  onPress={() => {props.navigation.navigate("TaskScreen")}} >
                    <CardBig>
                        
                                
                                    <Text>Tasks</Text>
                               
                      
                    </CardBig>
                </Pressable>
               
               <View style={styles.viewCards}>
                    <Pressable android_ripple={{ color: 'black', }} onPress={()=> handleNavigateToRecentSong()}>
                        <Card>
                            <Text> {recentTitle} </Text>
                        </Card>
                    </Pressable>

                    <Pressable android_ripple={{ color: 'black', }} onPress={()=> handleNavigateToRecentSong2()} >
                        <Card>
                            <Text> {recentTitle2} </Text>
                        </Card>
                    </Pressable>
               </View>
            </ScrollView>

            <View>
                <Pressable style={styles.button} android_ripple={{ color: 'black', }} onPress={() => {props.navigation.navigate("CreateScreen")}}>                                                                           
                    <Text>Create</Text>
                </Pressable>
            </View>

            <Navigation Style={styles.navigation} navigation={props.navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    RosterList:{
        fontSize: 20, 
    },
    titles:{
        color:"white"
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

export default HomeScreen;