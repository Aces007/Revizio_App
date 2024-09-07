import React, {useState} from "react"
import { View, TextInput, TouchableOpacity, Text , Modal, StyleSheet } from 'react-native';
import { useAppContext } from "../AppContext";

const EditCardModal = ({ visible, setModalVisible, card, deckList }) => {
    const { updateCardContent } = useAppContext();
    const [newQuestion, setNewQuestion] = useState(card?.question || '');
    const [newAnswer, setNewAnswer] = useState(card?.answer || '');
    const [newDeckId, setNewDeckId] = useState(card?.deckId || deckList[0]?.id);

    const handleUpdate = () => {
        updateCardContent(card.id, newDeckId, newQuestion, newAnswer);
        setModalVisible(false);
    }
    
    return (
        <Modal visible={visible} transparent={false}>
            <View style={styles.modal_cont}>
                <Text style={styles.editCard_head}>Edit New Card</Text>
                <TextInput 
                    style={styles.input_newQuestion}
                    value={newQuestion}
                    onChangeText={setNewQuestion}                    
                />

                <TextInput 
                    style={styles.input_newAnswer}
                    value={newAnswer}
                    onChangeText={setNewAnswer}
                />
                <TouchableOpacity onPress={handleUpdate} style={styles.editCard_btn}>
                    <Text style={styles.editCard_btnTxt}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.editCard_close}>
                    <Text style={styles.editCard_closeTxt}>Close</Text>
                </TouchableOpacity> 
            </View>
        </Modal>
    )
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
    editCard_head: {
        fontSize: 45,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    input_newQuestion: {
        borderWidth: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    input_newAnswer: {
        borderWidth: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    editCard_btn: {
        backgroundColor: '#FFA500', 
        padding: 10,
        borderRadius: 5,
        width: '40%',
    },
    editCard_btnTxt: {
        color: '#F0FFF0',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    editCard_close: {
        backgroundColor: '#FF0000', 
        padding: 10,
        borderRadius: 5,
        width: '20%',
    },
    editCard_closeTxt: {
        color: '#F0FFF0',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
})


export default EditCardModal;