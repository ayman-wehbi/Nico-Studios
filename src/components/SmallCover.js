import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';


const ImageDetail = (props) => {

     console.log(props);

    return (
        <View> 
             <Image style={styles.img} source={props.imgSrc} />
             <Text style={styles.title}> {props.title} </Text>
        </View>
  );
}

const styles = StyleSheet.create({
    img: {
        height: 155,
        width: 155,
        alignSelf: "center",
        borderRadius: 5,
        marginTop: 5  
    },
    title: {
        marginTop: 5,
        fontSize: 16,
        alignSelf: "center"
    }
})

export default ImageDetail