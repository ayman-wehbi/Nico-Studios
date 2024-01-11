import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './src/screens/HomeScreen';
import Settings from './src/screens/SettingsScreen';
import Projects from './src/screens/ProjectsScreen';
import SongScreen from './src/screens/SongScreen';
import SongList from './src/screens/SongList';
import LoginScreen from './src/screens/LoginScreen.js';
import CreateScreen from './src/screens/CreateScreen';
import CreateSongScreen from './src/screens/CreateSongScreen';
import EditScreen from './src/screens/EditScreen';
import TaskScreen from './src/screens/TaskScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';  
import ProjectDetails from './src/screens/ProjectDetails';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from './src/context/NoteContext';
import { CardStyleInterpolators } from '@react-navigation/stack';

const Stack = createStackNavigator();

const fadeInOut = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <StatusBar backgroundColor="#face88" barStyle="dark-content" />
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerTitle: 'Nico Studios',
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],

                },
              };
            },
            headerTitleStyle: {
              color: 'black',
            },
            headerStyle: {
              backgroundColor: '#face88',
              borderBottomWidth: 0, 
              elevation: 0,
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Projects" component={Projects} options={{ headerTitle: 'Projects', headerLeft: () => null, cardStyleInterpolator: fadeInOut}} />
          <Stack.Screen name="SongList" component={SongList} options={{ headerTitle: 'Songs', headerLeft: () => null, cardStyleInterpolator: fadeInOut }} />
          <Stack.Screen name="TaskScreen" component={TaskScreen} />
          <Stack.Screen name="SongScreen" component={SongScreen} options={{ headerTitle: 'Song'}}/>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="CreateSongScreen" component={CreateSongScreen} />
          <Stack.Screen name="CreateScreen" component={CreateScreen} />
          <Stack.Screen name="ProjectsScreen" component={ProjectsScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen}options={{ headerShown: false }} />
          <Stack.Screen name="ProjectDetails" component={ProjectDetails} options={{ headerTitle: 'Project Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
