
import mainContext from "./mainContext";

const songReducer = (state, action) => {
    switch(action.type){
        case 'add_song':
            return [...state, {id: Math.floor(Math.random() * 9999), 
                title: action.payload.title, 
                content: action.payload.content  }]
        
            case 'add_lyrics' : 
            return [...state, {id: Math.floor(Math.random() * 999), 
                words: action.payload.words  }]
        

        case 'write' : 
            return state.map((songFile) => {
               if(songFile.id === action.payload.id){
                    return action.payload;

                }
                else{
                    return songFile;
                }
            })
            case 'lyrics' : 
            return state.map((songFile) => {
                if (songFile.id === action.payload.id){
                    return action.payload;

                }
                else{
                    return songFile;
                }
                
            })

            case 'write_lyrics' : 
        return state.map((lyricFile) => {
            if(lyricFile.id === action.payload.id){
                return action.payload;
                    }
            else{
                return lyricFile;
                    }
                })


           

        case 'delete_song':
            return state.filter((songFile) => {
                return songFile.id !== action.payload
            })
        
            default:
                return state;
    }
    
}   
    
     const addSong = (dispatch) => {
        return (title, content, callback) =>{
            dispatch({type: 'add_song', payload:{title, content}})
            if(callback){
                callback();
            }
    
        }
    }

    const addLyric = (dispatch) => {
        return (lyricFile) =>{
            dispatch({type: 'add_lyrics', payload:{lyricFile}})
        }
    }
    

    const write = (dispatch, setRecentlyEditedSong) => {
        return (id, title, content, callback) =>{
            const editedSong = { id, title, content };
            // Call setRecentlyEdited with the edited song
            setRecentlyEdited(editedSong);
            
            dispatch({type: 'write', payload:{id: id, title: title,  content: content}})
            if(callback){
                callback();
            }
        }
    }

    const writelyrics = (dispatch) => {
        return (id, words, callback) =>{
            dispatch({type: 'write_lyrics', payload:{id: id, words, words}})
          
        }
    }
    const lyrics = (dispatch) => {
        return (id,content, callback) =>{
            dispatch({type: 'lyrics', payload:{id: id, content: content}})
            if(callback){
                callback();
            }
        }
    }
            
    const deleteSong = (dispatch) => {
        return (id) => {
          dispatch({ type: 'delete_song', payload: id });
        }
    }
    const setRecentlyEdited = (dispatch) => {
        return (id) => {
            dispatch({ type: 'set_recently_edited', payload: id });
        };
    }
    
export const {Context, Provider} =  mainContext(songReducer, {addSong: addSong, write:write, deleteSong:deleteSong, lyrics:lyrics, addLyric: addLyric, writelyrics: writelyrics, setRecentlyEdited: setRecentlyEdited}, []);