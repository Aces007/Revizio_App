import React, { useState } from 'react';
import { View, TextInput, Alert, Modal, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { useAppContext } from '../AppContext';
import { Picker } from '@react-native-picker/picker';
import { categories } from './categories';

const AddDeckModal = ({ visible, setModalVisible }) => {
  const { addDeck } = useAppContext();
  const [deckName, setDeckName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [customCategory, setCustomCategory] = useState('');

  const handleAddDeck = () => {
    const category = selectedCategory === 'Custom' ? customCategory.trim() : selectedCategory;

    if(!deckName.trim()) {
      Alert.alert('Validation Error', 'Please enter a deck name');
      return;
    }

    if (!category) {
      Alert.alert('Validation Error', 'Please select or enter a category.');
      return;
    }

    addDeck(deckName.trim(), category);
    setModalVisible(false); 
    setDeckName('');
    setSelectedCategory(categories[0]);
    setCustomCategory('');
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.addDeck_cont}>
        <Text style={styles.addDeck_head}>Add New Deck</Text>
        <TextInput 
          placeholder="Deck Name"
          value={deckName}
          onChangeText={setDeckName}
          style={styles.addDeck_inp}
        />
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.addDeck_Picker}
        >
          {categories.map((category) => (
            <Picker.Item 
              label={category}
              value={category}
              key={category}
            />
          ))}
        </Picker>

        {selectedCategory === 'Custom' && (
          <TextInput 
            placeholder="Custom Category"
            value={customCategory}
            onChangeText={setCustomCategory}
            style={styles.inputCategory}
          />
        )}

        <TouchableOpacity onPress={handleAddDeck} style={styles.addDeck_Btn}>
          <Text style={styles.addDeck_btnTxt}>Add Deck</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.addDeck_Close}>
          <Text style={styles.addDeck_closeTxt}>Close</Text>
        </TouchableOpacity> 
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create ({
  addDeck_cont: {
    backgroundColor: '#FFF8DC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    borderColor: "red",
    gap: 20,
  },
  addDeck_Picker: {
    backgroundColor: '#F5DEB3',
    width: '75%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  addDeck_head: {
    fontSize: 45,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  addDeck_inp: {
    width: '75%',
    borderWidth: 2,
    borderColor: '#A9A9A9',
    padding: 5,
  },
  inputCategory: {
    width: '75%',
    borderWidth: 2,
    borderColor: '#A9A9A9',
    padding: 5,
  },
  addDeck_Btn: {
    backgroundColor: '#FFA500', 
    padding: 10,
    borderRadius: 5,
    width: '40%',
  },
  addDeck_btnTxt: {
    color: '#F0FFF0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addDeck_Close: {
    backgroundColor: '#FF0000', 
    padding: 10,
    borderRadius: 5,
    width: '20%',
  },
  addDeck_closeTxt: {
    color: '#F0FFF0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})


export default AddDeckModal;
