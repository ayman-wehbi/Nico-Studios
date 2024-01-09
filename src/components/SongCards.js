
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function songCards(props){
  return (
    <View style={styles.card}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: 'gray',
  },
});
