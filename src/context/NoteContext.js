import mainContext from "./mainContext";
import { AsyncStorage } from 'react-native';

// Reducer
const songReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'add_song':
      const {  title, content } = action.payload;
      const newSong = { id: Math.floor(Math.random() * 9999), title, content };
      return {
        ...state,
        songs: [...state.songs, newSong],
        projects: state.projects.map((project) =>
          project.id === projectId
            ? { ...project, songs: [...project.songs, newSong] }
            : project
        ),
      };

    case 'add_lyrics':
      return [
        ...state,
        { id: Math.floor(Math.random() * 999), words: action.payload.words },
      ];

    case 'add_song_to_project':
      console.log('Payload:', action.payload);
      const { songId, projectId } = action.payload;

      console.log('Current state before modification:', state);

      const updatedState = {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === projectId) {
            const updatedProject = {
              ...project,
              songs: [...project.songs, songId],
            };

            console.log('Updated project:', updatedProject);
            project = updatedProject;
            return updatedProject;
          }
          return project;c
        }),
      };

    console.log('Updated state after modification:', updatedState);

    return updatedState;

    case 'add_project':
      const { id, name, createdDate, songs } = action.payload;
      const newProject = { id, name, createdDate, songs: songs || [] };
      return {
        ...state,
        projects: [...state.projects, newProject],
      };

    case 'delete_project':
      console.log('Deleting project with ID:', action.payload);
      const updatedProjects = state.projects.filter((project) => project.id !== action.payload);
      return { ...state, projects: updatedProjects };

    case 'write':
      return state.map((songFile) => {
        if (songFile.id === action.payload.id) {
          return action.payload;
        } else {
          return songFile;
        }
      });

    case 'lyrics':
      return state.map((songFile) => {
        if (songFile.id === action.payload.id) {
          return action.payload;
        } else {
          return songFile;
        }
      });

    case 'write_lyrics':
      return state.map((lyricFile) => {
        if (lyricFile.id === action.payload.id) {
          return action.payload;
        } else {
          return lyricFile;
        }
      });

    case 'delete_song':
      // Filter the 'songs' array to remove the song with the matching 'id'
      const updatedSongs = state.songs.filter((songFile) => songFile.id !== action.payload);
      
      // Return the updated state with the modified 'songs' array
      return {
        ...state,
        songs: updatedSongs
      };

    default:
    return state;
  }
};

// Actions
const addSong = (dispatch) => {
  return (title, content, projectId, callback) => {
    dispatch({ type: 'add_song', payload: { title, content, projectId } });
    if (callback) {
      callback();
    }
  };
};

const addSongToProject = (dispatch) => {
  return (songId, projectId) => {
    dispatch({ type: 'add_song_to_project', payload: { songId, projectId } });
  };
};

const addProject = (dispatch) => {
  return (name,createdDate, songs) => {
    const newProject = { id: Math.floor(Math.random() * 9999), name, createdDate, songs: songs || [] };
    console.log("Creating project with date:", createdDate); 
    // Save to AsyncStorage
    AsyncStorage.setItem(`project_${newProject.id}`, JSON.stringify(newProject))
      .then(() => {
        // Dispatch action to update context state
        dispatch({ type: 'add_project', payload: newProject });
      })
      .catch((error) => {
        console.error('Error saving project to AsyncStorage:', error);
      });
  };
};

const addLyric = (dispatch) => {
  return (lyricFile) => {
    dispatch({ type: 'add_lyrics', payload: { lyricFile } });
  };
};

const deleteProject = (dispatch) => {
  return (projectId) => {
    console.log('Deleting project with ID:', projectId);
    dispatch({ type: 'delete_project', payload: projectId });
  };
};

const write = (dispatch, setRecentlyEditedSong) => {
  return (id, title, content, callback) => {
    const editedSong = { id, title, content };
    setRecentlyEdited(editedSong);
    dispatch({ type: 'write', payload: { id, title, content } });
    if (callback) {
      callback();
    }
  };
};

const writelyrics = (dispatch) => {
  return (id, words, callback) => {
    dispatch({ type: 'write_lyrics', payload: { id, words } });
  };
};

const lyrics = (dispatch) => {
  return (id, content, callback) => {
    dispatch({ type: 'lyrics', payload: { id, content } });
    if (callback) {
      callback();
    }
  };
};

const deleteSong = (dispatch) => {
  return (id) => {
    dispatch({ type: 'delete_song', payload: id });
  };
};

const setRecentlyEdited = (dispatch) => {
  return (id) => {
    dispatch({ type: 'set_recently_edited', payload: id });
    AsyncStorage.removeItem(`song_${id}`);
  };
};

// Export Context and Provider
export const { Context, Provider } = mainContext(songReducer, {
  addSong,
  write,
  deleteSong,
  lyrics,
  addLyric,
  writelyrics,
  setRecentlyEdited,
  addSongToProject,
  addProject,
  deleteProject,
}, []);
