import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../AppContext';

const AddCardModal = ({ visible, setModalVisible }) => {
  const { decks, addCard } = useAppContext();
  const [selectedDeck, setSelectedDeck] = useState(decks[0]?.id);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect (() => {
    if (decks.length > 0) {
      setSelectedDeck(decks[0]?.id || '');
    }
  }, [decks]);

  const handleAddCard = () => {
    if (!selectedDeck || !question || !answer) {
      alert('Please fill in all the fields.');
      return;
    } else {
      addCard(selectedDeck, question, answer);
      setModalVisible(false);
      setQuestion('')
      setAnswer('')
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.addCard_cont}>
        <Text style={styles.addCard_head}>Add New Card</Text>
        <Picker
          selectedValue={selectedDeck}
          onValueChange={(itemValue) => setSelectedDeck(itemValue)}
          style={styles.addCard_Picker}
        >
          {decks.map(deck => (
            <Picker.Item 
              label={deck.name} 
              value={deck.id} 
              key={deck.id} 
            />
          ))}
        </Picker>
        <TextInput 
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
          style={styles.addCard_inpQues}
        />
        <TextInput 
          placeholder="Answer"
          value={answer}
          onChangeText={setAnswer}
          style={styles.addCard_inpAnsw}
        />
        <TouchableOpacity onPress={handleAddCard} style={styles.addCard_Btn}>
          <Text style={styles.addCard_btnTxt}>Add Card</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.addCard_Close}>
          <Text style={styles.addCard_closeTxt}>Close</Text>
        </TouchableOpacity>       
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create ({
  addCard_cont: {
    flex: 1,
    backgroundColor: '#FFF8DC',
    justifyContent: 'center',
    width: 'auto',
    gap: 20,
  },

  addCard_head: {
    fontSize: 45,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  addCard_Picker: {
    backgroundColor: '#F5DEB3',
    width: '75%',
    alignSelf: 'center',
    borderRadius: 10,
  },

  addCard_inpQues: {
    width: '75%',
    borderWidth: 2,
    borderColor: '#A9A9A9',
    padding: 5,
    alignSelf: 'center',
  },
  
  addCard_inpAnsw: {
    width: '75%',
    borderWidth: 2,
    borderColor: '#A9A9A9',
    padding: 5,
    alignSelf: 'center',

  },

  addCard_Btn: {
    backgroundColor: '#FFA500', 
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignSelf: 'center',
  },

  addCard_btnTxt: {
    color: '#F0FFF0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  addCard_Close: {
    backgroundColor: '#FF0000', 
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignSelf: 'center',
  },
  
  addCard_closeTxt: {
    color: '#F0FFF0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})



export default AddCardModal;

