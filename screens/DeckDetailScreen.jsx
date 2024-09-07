import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '../AppContext';

const DeckDetailScreen = ( { route, navigation } ) => {
    const { deckId } = route.params;
    const { decks, cards } = useAppContext();

    const deck = decks.find(d => d.id === deckId);
    const deckCards = cards.filter(card => card.deckId === deckId);

    const startQuiz = () => {
        navigation.navigate('QuizScreen', {deckId});
    }

    return (
        <View style={styles.deckReview_cont}>
            <Text style={styles.deckReview_head}>{deck.name}</Text>
            <FlatList 
                data={deckCards}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.deckCard_cont}>
                        <Text style={styles.deckCard_Ques}>{item.question}</Text>
                        <Text style={styles.deckCard_Ans}>{item.answer}</Text>
                    </View>
                )}
            />
            <TouchableOpacity onPress={startQuiz} style={styles.quizStart}>
                <Text style={styles.quizStart_Txt}>Start Quiz</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create ({
    deckReview_cont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#FFF8DC',
    },
    deckReview_head: {
        fontSize: 30,
        borderWidth: 2,
        backgroundColor: '#FFFAE5',
        borderRadius: 5,
        letterSpacing: 2,
        textTransform: 'uppercase',
        paddingVertical: 10,
        paddingHorizontal: 30,
        fontWeight: '800',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginVertical: 15,
    },
    deckCard_cont: {
        flex: 1,
        marginTop: 20,
        borderWidth: 1,
        gap: 10,
        width: '100%',
        borderColor: '#FFEDBA',
        backgroundColor: '#FFF8DC',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2.5,
    },
    deckCard_Ques: {
        fontSize: 18,
        fontWeight: '800',
    },
    deckCard_Ans: {
        fontSize: 16,
        fontWeight: '600',
    },
    quizStart: {
        alignSelf: 'center',
        backgroundColor: '#FFA500', 
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginVertical: 15,
    },
    quizStart_Txt: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
export default DeckDetailScreen;