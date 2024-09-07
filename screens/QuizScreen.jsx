import React, {useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../AppContext';
import { supabase } from '../supabaseClient';
import QuizResult from './QuizResult';

const QuizScreen = ({ route, navigation }) => {
    const { deckId } = route.params
    const { cards, setCards, calculateAccuracy, calculateProgress, userId } = useAppContext();
    const deckCards = cards.filter(card => card.deckId === deckId);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answeredQuestion, setAnsweredQuestion] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);

    const handleSubmit = async () => {
        if (deckCards.length === 0) return;
    
        const correctAnswer = deckCards[currentQuestion].answer.trim();
        const userResponse = userAnswer.trim();
        let isCorrect = false;
    
        if (!isNaN(userResponse) && !isNaN(correctAnswer)) {
            if (parseFloat(userResponse) === parseFloat(correctAnswer)) {
                setScore(prevScore => prevScore + 1);
                isCorrect = true;
            }
        } else if (userResponse.toLowerCase() === correctAnswer.toLowerCase()) {
            setScore(prevScore => prevScore + 1);
            isCorrect = true;
        }
    
        // Update the card in the state with the isCorrect property
        const updatedCards = cards.map(card =>
            card.id === deckCards[currentQuestion].id ? { ...card, isCorrect } : card
        );
    
        // Update the cards state
        setCards(updatedCards);
    
        // Calculate progress using the updated cards
        const progress = calculateProgress(updatedCards, deckId);
        console.log("Progress:", progress);
        setShowAnswer(true);
    };

    const handleQuizEnd = async () => {
        try {
            // Calculate accuracy and progress
            const accuracy = calculateAccuracy(cards); 
            const progress = calculateProgress(cards, deckId); 

            // Insert into the Accuracy table
            const { data: accuracyData, error: accuracyError } = await supabase
                .from('Accuracy')
                .insert([{ 
                    user_id: userId, // Use userId from context
                    accuracy
                }]);

            if (accuracyError) {
                console.error('Error saving accuracy:', accuracyError);
                return;
            }

            // Insert into the DeckProgress table
            const { data: progressData, error: progressError } = await supabase
                .from('DeckProgress')
                .insert([{ 
                    user_id: userId,
                    deck_id: deckId.toString(), 
                    progress 
                }]);

            if (progressError) {
                console.error('Error saving deck progress:', progressError);
                return;
            }

            // After saving, navigate to the QuizResult screen
            navigation.navigate('QuizResult', { score, total: deckCards.length });

        } catch (error) {
            console.error('Error during quiz end handling:', error);
        }
    };
    
    const handleNext = () => {
        if (currentQuestion + 1 < deckCards.length) {
            setCurrentQuestion(prev => prev + 1);
            setShowAnswer(false);
            setUserAnswer('');
        } else {
            handleQuizEnd();
        }
    };

    if (deckCards.length === 0) {
        return (
            <View style={styles.quizCont}>
                <Text>No cards in this deck</Text>
            </View>
        );
    }

    const card = deckCards[currentQuestion];


    return (
        <View style={styles.quizCont}>
            <Text style={styles.quizCount}>{`Question ${currentQuestion + 1} of ${deckCards.length}`}</Text>
            <Text style={styles.quizQuestion}>{card.question}</Text>
            <TextInput 
                placeholder='Type Your Answer'    
                value={userAnswer}
                onChangeText={setUserAnswer}
                editable={!showAnswer} 
                style={styles.answerInput}
            />
            {
                showAnswer && (
                    <Text style={styles.answerValid}>
                        {userAnswer.trim() === card.answer.trim() 
                        ? "Correct!" 
                        : `Incorrect! The answer is: ${card.answer}`}
                    </Text>
            )}
            <TouchableOpacity 
                onPress={showAnswer ? handleNext : handleSubmit} 
                disabled={!showAnswer && userAnswer.trim() === ''}
                style={styles.answerValidBtn}
            >
                <Text style={styles.answerBtnText}>{showAnswer ? "Next" : "Submit"}</Text>    
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create ({
    quizCont: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF8DC',
        paddingTop: 40,
        gap: 20,
        alignItems: 'center',
    },
    quizCount: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    quizQuestion: {
        fontSize: 25,
    },  
    answerInput: {
        borderWidth: 2,
        borderColor: '#B2BEB5',
        width: '100%',
        padding: 10,
    },  
    answerValid: {
        fontSize: 20,
        color: '#FFA500',
        textTransform: 'uppercase',
    },  
    answerValidBtn: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 4,
        width: '40%'
    },
    answerBtnText: {
        color: '#fff',
        fontWeight: "700",
        textAlign: 'center',
    }
})

export default QuizScreen;