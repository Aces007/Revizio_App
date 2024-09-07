import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../AppContext';
import { Picker } from "@react-native-picker/picker";
import { categories } from './categories';

const EditDeckModal = ({ visible, setModalVisible, deckId, deck }) => {
    const { updateDeck } = useAppContext();
    
    // Initialize state only once with deck prop or when it changes
    const [deckName, setDeckName] = useState(deck?.name || '');
    const [selectedCategory, setSelectedCategory] = useState(deck?.category || '');
    const [customCategory, setCustomCategory] = useState('');

    // Use useEffect to update state when deck prop changes
    useEffect(() => {
        if (deck) {
            setDeckName(deck.name);
            setSelectedCategory(deck.category);
            setCustomCategory(deck.category && !categories.includes(deck.category) ? deck.category : '');
        }
    }, [deck]);

    const handleUpdateDeck = () => {
        const category = selectedCategory === 'Custom' ? customCategory.trim() : selectedCategory;

        if (!deckName.trim()) {
            Alert.alert('Validation error', 'Please enter a deck name');
            return;
        }

        if (!category) {
            Alert.alert('Validation Error', 'Please select or enter a category.');
            return;
        }

        updateDeck(deckId, deckName.trim(), category);
        setModalVisible(false);
    };

    return (
        <Modal visible={visible} transparent={false}>
            <View style={styles.modal_cont}>
                <Text style={styles.editDeck_head}>Edit Deck</Text>
                <TextInput 
                    placeholder="Deck Name"
                    style={styles.input_newName}
                    value={deckName}
                    onChangeText={setDeckName}
                />

                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    style={styles.editDeck_Picker}
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

                <TouchableOpacity onPress={handleUpdateDeck} style={styles.editDeck_btn}>
                    <Text style={styles.editDeck_btnTxt}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.editDeck_close}>
                    <Text style={styles.editDeck_closeTxt}>Close</Text>
                </TouchableOpacity> 
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create ({
    modal_cont: {
        backgroundColor: '#FFF8DC',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        borderColor: "red",
        gap: 20,
    },
    editDeck_head: {
        fontSize: 45,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    editDeck_Picker: {
        backgroundColor: '#F5DEB3',
        width: '75%',
        alignSelf: 'center',
        borderRadius: 10,
    },
    input_newName: {
        borderWidth: 1,
        paddingHorizontal: 70,
        paddingVertical: 10,
    },
    inputCategory: {
        width: '75%',
        borderWidth: 2,
        borderColor: '#A9A9A9',
        padding: 5,
    },
    editDeck_btn: {
        backgroundColor: '#FFA500', 
        padding: 10,
        borderRadius: 5,
        width: '40%',
    },
    editDeck_btnTxt: {
        color: '#F0FFF0',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    editDeck_close: {
        backgroundColor: '#FF0000', 
        padding: 10,
        borderRadius: 5,
        width: '20%',
    },
    editDeck_closeTxt: {
        color: '#F0FFF0',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EditDeckModal;
