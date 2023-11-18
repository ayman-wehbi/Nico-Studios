import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './src/screens/HomeScreen';
import Settings from './src/screens/SettingsScreen';
import Projects from './src/screens/ProjectsScreen';
import SongScreen from './src/screens/SongScreen';
import SongList from './src/screens/SongList';
import CreateScreen from './src/screens/CreateScreen';
import CreateSongScreen from './src/screens/CreateSongScreen';
import EditScreen from './src/screens/EditScreen';
import TaskScreen from './src/screens/TaskScreen';
import { Provider } from './src/context/NoteContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTitle: 'Nico Studios',
            headerTitleStyle: {
              color: 'black',
            },
            headerStyle: {
              backgroundColor: '#face88',
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="TaskScreen" component={TaskScreen} />
          <Stack.Screen name="SongScreen" component={SongScreen} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Projects" component={Projects} />
          <Stack.Screen name="CreateSongScreen" component={CreateSongScreen} />
          <Stack.Screen name="CreateScreen" component={CreateScreen} />
          <Stack.Screen name="EditScreen" component={EditScreen} />
          <Stack.Screen name="SongList" component={SongList} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
