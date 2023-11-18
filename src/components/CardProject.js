import React from 'react';
import { StyleSheet, View} from 'react-native';

export default function CardBig(props){
    return (
        <View style={styles.card}>
            <View tyle={styles.view}>
                <View style={styles.cardContent}>
                    {props.children}
                </View>
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
            marginHorizontal: 8,
            marginVertical: 8,
            height:190,
            width: 170,
	},
    cardCon: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    view:{
        marginLeft: 20,
    }
})