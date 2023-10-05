
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React, { useState } from "react";
import Home from "./src/screens/HomeScreen";
import Settings from "./src/screens/SettingsScreen";
import Projects from "./src/screens/ProjectsScreen";
import SongScreen from "./src/screens/SongScreen";
import SongList from "./src/screens/SongList";
import CreateScreen from "./src/screens/CreateScreen";
import CreateSongScreen from "./src/screens/CreateSongScreen";
import EditScreen from "./src/screens/EditScreen";
import TaskScreen from "./src/screens/TaskScreen";
import { Provider} from "./src/context/NoteContext"


const navigator = createStackNavigator(
  {
    Home: Home,
    TaskScreen : TaskScreen,
    SongScreen : SongScreen,
    Settings : Settings,
    Projects : Projects, 
    CreateSongScreen : CreateSongScreen,
    CreateScreen : CreateScreen,
    EditScreen : EditScreen,
    SongList : SongList,
    
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
    title: "Nico Studios",
    headerTitleStyle: {
      color: 'black',
    },
    headerStyle:{
      backgroundColor: '#face88', 
      // use your preferred color code
    }
    },
  }
);
const App = createAppContainer(navigator);

export default () => {
  return <Provider>
    <App />
  </Provider>
}