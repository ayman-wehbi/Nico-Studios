import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const CardProject = ({ title, onDelete, onPress, onInfoPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text style={styles.buttonText}>⋮</Text> 
        </TouchableOpacity>

        {/* Modal for the three-dot menu */}
        <Modal
          transparent={true}
          visible={menuVisible}
          onRequestClose={toggleMenu}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={toggleMenu}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={onInfoPress} style={styles.menuOption}>
                <Text style={styles.menuText}>Info</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.menuOption}>
                <Text style={styles.menuText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffd9e3',
    padding: 16,
    margin: 7,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    // Align buttons vertically
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  infoButton: {
    // Add styles for the info button, similar to deleteButton
    marginBottom: 8, // Add space between the info and delete buttons
  },
  deleteButton: {
    // Style your delete button
  },
  buttonText: {
    // Style for text inside the buttons
    fontSize:25,
  },
  menuButton: {
    // Style your menu button (three-dot icon)
    padding: 5,
    fontSize:15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    margin: 10,
    backgroundColor: "#ffd9e3", // Background color of the modal
    borderRadius: 8,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    padding: 10,
  },
  menuText: {
    fontSize: 16,
  },
});

export default CardProject;
