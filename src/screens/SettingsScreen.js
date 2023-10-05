import React from 'react';
import { Text, StyleSheet ,View} from 'react-native';

const SettingsScreen = () => {
  return <View> 
  <Text style={styles.text}>Settings</Text> 
 <Text>{"\n"}</Text>
 <Text style={styles.text2}>Font Size{"\n"}</Text>
<Text style={styles.text2}>Dark Mode{"\n"}</Text>
 <Text style={styles.text2}>Keep Screen On{"\n"}</Text>
  
 </View>
};

const styles = StyleSheet.create({
  text: {
    fontSize: 60,
  },
  text2: {
    fontSize: 25,
  },
});

export default SettingsScreen;
