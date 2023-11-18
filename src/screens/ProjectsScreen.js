import React from 'react';
import { Text, StyleSheet ,View, Pressable, ScrollView} from 'react-native';
import SmallCover from "../components/SmallCover"
import CardProject from "../components/CardProject"
import Navigation from '../components/Navigation';

//IN THE WORKS

const ProjectPage = (props) => {
    return<View style={styles.contentContainer}>
            <ScrollView>
                <Text style={styles.title}> 
                    Projects (Sample)
                </Text>
                        <View style={styles.viewCards}>
                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/album.jpg")} title={"The Marshall Mather LP"}/>
                            </CardProject>
                                
                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/taboo.jpg")} title={"TA13OO"}/>
                            </CardProject>
                            
                        </View>

                        <View style={styles.viewCards}>
                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/gkmc.jpg")} title={"good kid maad city "}/>
                            </CardProject>
                            
                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/tpab.webp")} title={"To Pimp a Butterfly "}/>
                            </CardProject>
                            
                        </View>

                        <View style={styles.viewCards}>
                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/mme.webp")} title={"Melt My Eyez"}/>
                            </CardProject>

                            <CardProject>       
                                <SmallCover  imgSrc={require("../assets/blond.jpeg")} title={"Blond"}/>
                            </CardProject>
                            
                        </View>

                        <View style={styles.viewCards}>
                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/tos.webp")} title={"The Off Season"}/>
                            </CardProject>

                            <CardProject>
                                <SmallCover  imgSrc={require("../assets/dielit.webp")} title={"Die Lit"}/>
                            </CardProject>
                            
                        </View>
            </ScrollView>
                    <View>
                    <Pressable style={styles.button} android_ripple={{ color: 'black', }} onPress={() => {props.navigation.navigate("CreateScreen")}
                                                                                                    }
                    >
                    <Text>Create</Text>
                    </Pressable>
                </View>

                <Navigation Style={styles.navigation} navigation={props.navigation}/>
        </View>
              
           
};

const styles = StyleSheet.create({
    Text: {fontSize: 60,
    },
    contentContainer: {
        flex: 1, // pushes the footer to the end of the screen
        backgroundColor: "#0f0f0f"
    },
    viewCards: {
        flexDirection:'row',
        marginLeft: 10,
    
  
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
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 6,
        color:  '#ffd9e3',
    },
});
export default ProjectPage;