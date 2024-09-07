import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const QuizResult = ({ route, navigation }) => {
    const { score, total } = route.params;

    return (
        <View style={styles.quiz_cont}>
            <Text style={styles.header_quiz}>Quiz Completed!</Text>
            <Text style={styles.score_quiz}>{`You scored ${score} out of ${total}`}</Text>
            <TouchableOpacity 
                onPress={() => navigation.navigate('Home')}
                style={styles.deck_btn}
            >
                <Text 
                    style={styles.deck_btnTxt}
                >
                    Go To Decks
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create ({
    quiz_cont: {
        flex: 1,
        padding: 40,
        backgroundColor: '#FFF8DC',
        paddingTop: 210,
        gap: 20,
        alignItems: 'center'
    },
    header_quiz: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: '800'
    },
    score_quiz: {
        textAlign: 'center',
        fontSize: 21,
    },
    deck_btn: {
        backgroundColor: '#FFA500',
        padding: 12,
        width: '50%',
        borderWidth: 4,
        borderColor: '#FFA500',
        borderRadius: 6,
    },
    deck_btnTxt: {
        fontSize: 15,
        textTransform: 'uppercase',
        color: '#fff',
        fontWeight: '800',
    }

})
export default QuizResult;