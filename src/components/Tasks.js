import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tasks = ({ tasks }) => {
  return (
    <View style={styles.container}>
     
      <View >
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
              {task.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  
  
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    
    
    paddingVertical: 5,
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 10,
    color: 'white',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default Tasks;
