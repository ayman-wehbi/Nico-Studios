import React from 'react';
import {StyleSheet, View,} from 'react-native';

export default function Card(props){
    return (
        <View style={styles.card}>
            <View style={styles.cardCon}>
                {props.children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
            borderRadius: 5,
            elevation: 3,
            backgroundColor: '#ffd9e3',
            shadowOffset: { width: 1, height: 1 },
            shadowColor: '#333',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            marginHorizontal: 11,
            marginVertical: 11,
            height:320,
            width: 370,
            justifyContent: 'center',
            alignItems: 'center',
	},
    cardCon: {   
        justifyContent: 'center',
    },
})