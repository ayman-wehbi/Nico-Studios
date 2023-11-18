import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import Tasks from '../components/Tasks';

const TaskListScreen = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from AsyncStorage when the component mounts
    const loadTasksFromAsyncStorage = async () => {
      try {
        const tasksJSON = await AsyncStorage.getItem('tasks');
        if (tasksJSON !== null) {
          const loadedTasks = JSON.parse(tasksJSON);
          setTasks(loadedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks from AsyncStorage:', error);
      }
    };

    loadTasksFromAsyncStorage();
  }, []);

  useEffect(() => {
    // Save tasks to AsyncStorage whenever tasks change
    const saveTasksToAsyncStorage = async () => {
      try {
        const tasksJSON = JSON.stringify(tasks);
        await AsyncStorage.setItem('tasks', tasksJSON);
      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
    };

    saveTasksToAsyncStorage();
  }, [tasks]);

  const addTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1); // Remove the task at the specified index
    setTasks(updatedTasks);
    
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => toggleTask(index)}
                      onLongPress={() => {
                                    
                                    deleteTask(index);
    }}>
      <View style={[styles.taskItem, item.completed && styles.completedTask]}>
        <CheckBox
          checked={item.completed}
          onPress={() => toggleTask(index)}
          containerStyle={styles.checkboxContainer}
          checkedColor="#0f0000"
        />
        <Text style={styles.taskText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          placeholderTextColor={'grey'}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
export default TaskListScreen;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#0f0f0f',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'white',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      borderRadius: 12,
    },
    input: {
      flex: 1,
      height: 40,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      borderRadius: 7,
      paddingLeft: 10,
      marginRight: 10,
      color: 'white',
    },
    addButton: {
      backgroundColor: '#FF45C9',
      borderRadius: 7,
      padding: 10,
    },
    addButtonText: {
      color: 'white',
    },
    taskContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxContainer: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    taskText: {
      flex: 1,
      marginLeft: -15,  
      color: 'black',
    },
    completedTaskText: {
      backgroundColor: '#d3ffd3', // Background color for completed tasks
      textDecorationLine: 'line-through',
    },
    taskItem: {
      flexDirection: 'row', // Add flexDirection to place checkbox and text horizontally
      alignItems: 'center', // Center align checkbox and text vertically
      backgroundColor: '#ffd9e3',
      borderRadius: 7,
      height: 50,
      marginBottom: 7,
    },
  });
  


