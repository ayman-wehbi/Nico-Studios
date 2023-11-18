import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import Navigation from '../components/Navigation';
import Card from '../components/Card';
import CardBig from '../components/CardBig';
import { AsyncStorage } from 'react-native';
import { Context as NoteContext, setRecentlyEdited } from '../context/NoteContext';

const HomeScreen = (props) => {
  const { state } = useContext(NoteContext);
  const [recentTitle, setRecentTitle] = useState("No recent song created");
  const [recentTitle2, setRecentTitle2] = useState("No recent song created");

  // Function to navigate to the most recent song
  const handleNavigateToRecentSong = () => {
    if (state.length > 0) {
      const sortedState = [...state].reverse();
      const recent = sortedState[0];
      props.navigation.navigate('SongScreen', { id: recent.id });
    }
  };

  // Function to navigate to the second most recent song
  const handleNavigateToRecentSong2 = () => {
    if (state.length > 1) {
      const sortedState = [...state].reverse();
      const recent = sortedState[1];
      props.navigation.navigate('SongScreen', { id: recent.id });
    }
  };

  useEffect(() => {
    // Set the title of the most recent song
    if (state.length > 0) {
      const sortedState = [...state].reverse();
      const mostRecentSong = sortedState[0];
      setRecentTitle(mostRecentSong.title);
    } else {
      setRecentTitle("No recent song created");
    }
  }, [state]);

  useEffect(() => {
    // Set the title of the second most recent song
    if (state.length > 1) {
      const sortedState = [...state].reverse();
      const mostRecentSong = sortedState[1];
      setRecentTitle2(mostRecentSong.title);
    } else {
      setRecentTitle2("No recent song created");
    }
  }, [state]);

  return (
    <View style={styles.contentContainer}>
      <ScrollView>
        <Text style={styles.ScreenTitle}> Nico Studios </Text>

        <View style={styles.viewCards}>
          <Pressable android_ripple={{ color: 'black', }}>
            <Card>
              <Text> Pinned Song </Text>
            </Card>
          </Pressable>

          <Pressable android_ripple={{ color: 'black', }}>
            <Card>
              <Text> Pinned project</Text>
            </Card>
          </Pressable>
        </View>

        <Pressable android_ripple={{ color: 'black', }} onPress={() => { props.navigation.navigate("TaskScreen") }}>
          <CardBig>
            <Text>Tasks</Text>
          </CardBig>
        </Pressable>

        <View style={styles.viewCards}>
          <Pressable android_ripple={{ color: 'black', }} onPress={handleNavigateToRecentSong}>
            <Card>
              <Text> {recentTitle} </Text>
            </Card>
          </Pressable>

          <Pressable android_ripple={{ color: 'black', }} onPress={handleNavigateToRecentSong2}>
            <Card>
              <Text> {recentTitle2} </Text>
            </Card>
          </Pressable>
        </View>
      </ScrollView>

      <View>
        <Pressable style={styles.button} android_ripple={{ color: 'black', }} onPress={() => { props.navigation.navigate("CreateScreen") }}>
          <Text>Create</Text>
        </Pressable>
      </View>

      <Navigation Style={styles.navigation} navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenTitle: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 6,
    color: '#ffd9e3',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f"
  },
  viewCards: {
    flexDirection: 'row',
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
});

export default HomeScreen;
