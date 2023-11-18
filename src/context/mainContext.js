import React, { useReducer, useState } from 'react';

export default (reducer, actions, initialState) => {
    const Context = React.createContext();

    const Provider = ({ children }) => {
        const [state, dispatch] = useReducer(reducer, initialState);
        const [recentlyEditedSong, setRecentlyEditedSong] = useState(null); // Initialize it with null

        const boundActions = {};
        for (let key in actions) {
            boundActions[key] = actions[key](dispatch, setRecentlyEditedSong); // Pass setRecentlyEditedSong to actions
        }

        const deleteSong = async (id) => {
            try {
              await AsyncStorage.removeItem(`song_${id}`);
              // Additional logic if needed
        
              // Update the state or perform any other actions
            } catch (error) {
              console.error('Error deleting song:', error);
            }
          };

        return (
            <Context.Provider value={{ state, ...boundActions, deleteSong, recentlyEditedSong }}>
                {children}
            </Context.Provider>
        );
    };

    return { Context, Provider };
};
