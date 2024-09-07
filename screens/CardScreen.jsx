import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AddCardModal from './AddCardModal';
import { useAppContext } from '../AppContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditCardModal from './EditCardModal';


const CardScreen = () => {
  const { cards, decks, removeCard } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleEdit = (card) => {
    setSelectedCard(card);
    setEditModalVisible(true);
  };

  const handleDeletion = (deckId) => {
    Alert.alert(
      "Delete Deck",
      "Are you sure you want to delete the deck?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => removeCard(deckId) }
      ],
      { cancelable: true }
    )
  }

  return (
    <View style={styles.card_cont}>
      <View style={styles.card_header}>
        <Text style={styles.headerText}>Your Cards</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <View style={styles.emptyCard_cont}>
          <Text style={styles.emptyCard_text}>No cards available. Add one to get started!</Text>
        </View>
      ) : (
        <FlatList 
          data={cards}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const deck = decks.find(deck => deck.id === item.deckId);
            return (
              <View style={styles.data_cont}>
                <View style={styles.data_header_cont}>
                  <Text style={styles.deck_name}>{deck ? deck.name : 'Unknown Deck'}</Text>
                  <View style={styles.btns_cont}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                      <MaterialCommunityIcons name="pencil-outline" size={24} color="#1434A4" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletion(item.id)} style={styles.deleteButton}>
                      <MaterialCommunityIcons name="delete-outline" size={24} color="#E34234" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.deck_quest}>{item.question}</Text>
                <Text style={styles.deck_ans}>{item.answer}</Text>
              </View>
            );
          }}
        />
      )}

      <AddCardModal visible={modalVisible} setModalVisible={setModalVisible} />
      {selectedCard && (
        <EditCardModal
          visible={editModalVisible}
          setModalVisible={setEditModalVisible}
          card={selectedCard}
          deckList={decks}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create ({
  data_header_cont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  emptyCard_cont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 170,
  },  
  emptyCard_text: {
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#808080',
  },  
  card_cont: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8DC',
    paddingTop: 40,
  },
  card_header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B2E2A'
  },
  addButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFA500', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  data_cont: {
    flex: 1,
    margin: 10,
    gap: 10,
    padding: 20,
    backgroundColor: '#FFFAE5',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2.5,
  },
  deck_name: {
    fontSize: 21,
    fontWeight: '800',
  },
  deck_quest: {
    fontSize: 17,
    fontWeight: '800',
    color: '#71797E',
  },
  deck_ans: {
    fontSize: 15,
    fontWeight: '700',
    color: '#71797E',
  },
  deleteButton: {
    alignSelf: 'flex-end'
  },
  btns_cont: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
})

export default CardScreen;
