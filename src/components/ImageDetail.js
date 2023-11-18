import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';


const ImageDetail = (props) => {
    return (
        <View>
             <Image style={styles.img} source={props.imgSrc} />
             <Text> {props.title} </Text>
        </View>
  );
}

const styles = StyleSheet.create({
    img: {
        height: 350,
        width: 350,
        marginLeft: "4%",
        borderRadius: 12,
        marginTop: 15    
    }
})

export default ImageDetail