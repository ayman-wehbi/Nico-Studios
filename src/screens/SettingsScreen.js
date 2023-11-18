import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
  // Render component
  return (
    <View>
      {/* Header text for Settings */}
      <Text style={styles.text}>Settings</Text>
      
      {/* Line breaks for spacing */}
      <Text>{"\n"}</Text>
      
      {/* Individual settings with their labels */}
      <Text style={styles.text2}>Font Size{"\n"}</Text>
      <Text style={styles.text2}>Dark Mode{"\n"}</Text>
      <Text style={styles.text2}>Keep Screen On{"\n"}</Text>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  text: {
    fontSize: 60,
  },
  text2: {
    fontSize: 25,
  },
});

export default SettingsScreen;
