import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../AppContext';
import AddDeckModal from './AddDeckModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EditDeckModal from './EditDeckModal';
import { categories } from './categories';

const DeckScreen = ({ navigation }) => {
  const { decks, removeDeck, cards } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const [sortOption, setSortOption] = useState('name_asc');
  const [filterCategory, setFilterCategory] = useState('All');

  const [displayedDecks, setDisplayedDecks] = useState([]);

  useEffect(() => {
    let sortedDecks = [...decks];
   
    // Content Filtering
    if (filterCategory !== 'All') {
      sortedDecks = sortedDecks.filter((deck) => deck.category === filterCategory);
    }
  
    // Sorting Method
    switch (sortOption) {
      case 'name_asc':
        sortedDecks.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedDecks.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date_newest':
        sortedDecks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'date_oldest':
        sortedDecks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'cards_asc':
        sortedDecks.sort((a, b) => getCardCount(a.id) - getCardCount(b.id));
        break;
      case 'cards_desc':
        sortedDecks.sort((a, b) => getCardCount(b.id) - getCardCount(a.id));
        break;
      default:
        break;
    }

    setDisplayedDecks(sortedDecks);
  }, [decks, sortOption, filterCategory]);

  const handleEdit = (deck) => {
    setSelectedDeck(deck);
    setEditModalVisible(true);
  };

  const handleDeletion = (deckId) => {
    Alert.alert(
      "Delete Deck",
      "Are you sure you want to delete the deck?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => removeDeck(deckId) }
      ],
      { cancelable: true }
    )
  };

  const getCardCount = (deckId) => {
    return cards.filter(card => card.deckId === deckId).length;
  };

  return (
    <View style={styles.deck_cont}>
      <View style={styles.deck_header}>
        <Text style={styles.headerText}>Your Decks</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add New Deck</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSortContainer}>
        <Picker
          selectedValue={filterCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setFilterCategory(itemValue)}
        >
          <Picker.Item label="All Categories" value="All" />
          {categories.map((category) => (
            <Picker.Item
              label={category}
              value={category}
              key={category}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={sortOption}
          style={styles.picker}
          onValueChange={(itemValue) => setSortOption(itemValue)}
        >
          <Picker.Item label="Name (A-Z)" value="name_asc" />
          <Picker.Item label="Name (Z-A)" value="name_desc" />
          <Picker.Item label="Date (Newest)" value="date_newest" />
          <Picker.Item label="Date (Oldest)" value="date_oldest" />
          <Picker.Item label="Cards (Fewest)" value="cards_asc" />
          <Picker.Item label="Cards (Most)" value="cards_desc" />
        </Picker>
      </View>

      {displayedDecks.length === 0 ? (
        <View style={styles.emptyDeck_cont}>
          <Text style={styles.emptyDeck_text}>No decks available. Add one to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={displayedDecks}
          numColumns={2} 
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.deckCard}>
              <TouchableOpacity onPress={() => navigation.navigate('DeckDetailScreen', { deckId: item.id })} style={styles.deckContainer}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name={item.icon || 'book'} size={40} color='#71797E' />
                </View>
                <Text style={styles.deckName}>{item.name || 'Untitled Deck'}</Text>
                <Text style={styles.cardCount}>
                  {getCardCount(item.id)} Cards
                </Text>
              </TouchableOpacity>
              <View style={styles.btns_cont}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                      <MaterialCommunityIcons name="pencil-outline" size={24} color="#1434A4" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletion(item.id)} style={styles.deleteButton}>
                  <MaterialCommunityIcons name="delete-outline" size={24} color="#E34234" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <AddDeckModal visible={modalVisible} setModalVisible={setModalVisible} />
      {selectedDeck && (
        <EditDeckModal
          visible={editModalVisible}
          setModalVisible={setEditModalVisible}
          deckId={selectedDeck.id}
          deck={selectedDeck} // Updated to use the whole deck object
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyDeck_cont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 170,
  },  
  emptyDeck_text: {
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#808080',
  },  
  deck_cont: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8DC',
    paddingTop: 40,
  },
  picker: {
    backgroundColor: '#FFFAE5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  deck_header: {
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
  deckCard: {
    flex: 1,
    margin: 10,
    padding: 20,
    gap: 15,
    backgroundColor: '#FFFAE5',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  deckContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconContainer: {
    marginBottom: 10,
  },
  deckName: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  deleteButton: {
    marginHorizontal: 5,
  },
  btns_cont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  filterSortContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 1,
  },
});

export default DeckScreen;
