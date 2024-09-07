import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [progress, setProgress] = useState({});
  const [mostReviewedDeck, setMostReviewedDeck] = useState('');
  const [userId, setUserId] = useState(null);

  
  useEffect(() => {
    if (userId) {
      fetchDecksAndCards(userId);
    }
  }, [userId]);
  

  useEffect(() => {
    if (userId) {
      loadMetrics(userId);
    }
  }, [userId]);

  const fetchDecksAndCards = async (userId) => {
    try {
      if (!userId) throw new Error('userId is undefined or null');
  
      const { data: decksData, error: decksError } = await supabase
        .from('Decks')
        .select('*')
        .eq('user_id', userId);
  
      if (decksError) throw decksError;
  
      if (decksData && decksData.length > 0) {
        const { data: cardsData, error: cardsError } = await supabase
          .from('Cards')
          .select('*')
          .in('deckId', decksData.map(deck => deck.id));
  
        if (cardsError) throw cardsError;
  
        setDecks(decksData);
        setCards(cardsData || []);
  
        calculateAccuracy(cardsData);
        calculateMostReviewedDeck(decksData, cardsData);
  
      } else {
        // Only reset if no decks are found
        resetMetrics();
      }
    } catch (error) {
      console.error('Error fetching decks and cards:', error);
    }
  };
  
  const signUp = async (email, username, password) => {
    try {
      const { data: signupData, error: authError } = await supabase.auth.signUp({ email, password }); 
      console.log('SignUp Response', signupData);

      if (authError) {
        console.error('Authentication Error:', authError.message);
        throw authError;
      }

      const user = signupData?.user;
      if (!user) {
        throw new Error('No user returned after sign-up.');
      }

      const { error: dbError } = await supabase
      .from('Users')
      .upsert({ id: user.id, email, username, created_at: new Date(), updated_at: new Date() }, 
      {
        onConflict: ['id']  
      });

      if (dbError) {
        console.error('Database error:', dbError.message);
        throw dbError;
      }

      setUserId(user.id);
      loadMetrics(user.id);

    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };
  
  const logIn = async (email, password) => {
    try {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        if (user?.id) {
            console.log('User ID after login:', user.id); 
            setUserId(user.id);
            fetchDecksAndCards(user.id);  
        } else {
            alert('Incorrect credentials provided! Try Again.');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        if (error.message.includes("email not confirmed")) {
            alert('Email not confirmed. Please check your inbox.');
        }
    }
  };
  

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
    
      if (error) throw error;
    
      setUserId(null);
      setAccuracy(0);
      setProgress(0);
      setMostReviewedDeck('');
    
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const loadMetrics = async (userId) => {
    try {
        await fetchDecksAndCards(userId); 

    } catch (error) {
        console.error('Error loading metrics:', error.message);
    }
  };


  const saveAccuracy = async (userId, accuracy) => {
    try {
      const { error } = await supabase.from('Accuracy').upsert({ user_id: userId, accuracy, updated_at: new Date() });
      if (error) throw error;
    } catch (error) {
      console.error('Error saving accuracy:', error);
    }
  };

  const calculateAccuracy = (cardsData) => {
    if (!cardsData || cardsData.length === 0) {
      setAccuracy(0);
      if (userId) saveAccuracy(userId, 0);
      return;
    }
    
    const correctAnswers = cardsData.filter(card => card.isCorrect).length;
    const accuracyPercentage = ((correctAnswers / cardsData.length) * 100).toFixed(2);

    setAccuracy(accuracyPercentage);
    if (userId) saveAccuracy(userId, accuracyPercentage);
  };

  const saveMostReviewedDeck = async (userId, deckName) => {
    try {
      const { error } = await supabase.from('MostReviewedDeck').upsert({ user_id: userId, deck_name: deckName, updated_at: new Date() });
      if (error) throw error;
    } catch (error) {
      console.error('Error saving most reviewed deck:', error);
    }
  };

  const calculateMostReviewedDeck = (decksData, cardsData) => {
    const deckReviewCount = {};

    cardsData.forEach(card => {
      deckReviewCount[card.deckId] = (deckReviewCount[card.deckId] || 0) + 1;
    });

    const mostReviewedDeckId = Object.keys(deckReviewCount).reduce((a, b) => deckReviewCount[a] > deckReviewCount[b] ? a : b, '');
    const mostReviewedDeck = decksData.find(deck => deck.id === mostReviewedDeckId)?.name || 'No Deck Found';

    setMostReviewedDeck(mostReviewedDeck);
    if (userId) saveMostReviewedDeck(userId, mostReviewedDeck);
  };

  const resetMetrics = () => {
    setDecks([]);
    setCards([]);
    setAccuracy(0);
    setMostReviewedDeck('');
    setProgress({});
  };

  const calculateProgress = (cardsData, deckId) => {
    const deckCards = cardsData.filter(card => card.deckId === deckId);
    const totalCards = deckCards.length;
    const completedCards = deckCards.filter(card => card.isCorrect).length;

    console.log("Completed Cards:", completedCards, "Total Cards:", totalCards);
    
    const progress = totalCards === 0 ? 0 : (completedCards / totalCards) * 100;
    return progress;
  };

  

  const addDeck = async (name, category) => {
    try {
      const { data, error } = await supabase
        .from('Decks')
        .insert([{ name, category, user_id: userId, created_at: new Date() }])
        .select();
      if (error) throw error;

      setDecks(prev => [...prev, ...data]);
    } catch (error) {
      console.error('Error adding deck:', error);
    }
  };

  const removeDeck = async (deckId) => {
    try {
      const { error } = await supabase.from('Decks').delete().eq('id', deckId);
      if (error) throw error;

      setDecks(prev => prev.filter(deck => deck.id !== deckId));
    } catch (error) {
      console.error('Error removing deck:', error);
    }
  };

  const addCard = async (deckId, question, answer) => {
    try {
      const { data, error } = await supabase.from('Cards').insert([{ deckId, question, answer }]).select();
      if (error) throw error;

      setCards(prev => [...prev, ...data]);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const removeCard = async (cardId) => {
    try {
      const { error } = await supabase.from('Cards').delete().eq('id', cardId);
      if (error) throw error;

      setCards(prev => prev.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Error removing card:', error);
    }
  };

  const updateDeck = async (deckId, name, category) => {
    try {
      const { error } = await supabase.from('Decks').update({ name, category }).eq('id', deckId);
      if (error) throw error;

      setDecks(prevDecks => prevDecks.map(deck => (deck.id === deckId ? { ...deck, name, category } : deck)));
    } catch (error) {
      console.error('Error updating deck:', error);
    }
  };

  const updateCardContent = async (cardId, newDeckId, newQuestion, newAnswer) => {
    try {
      const { error } = await supabase.from('Cards').update({ deckId: newDeckId, question: newQuestion, answer: newAnswer }).eq('id', cardId);
      if (error) throw error;

      setCards(prevCards => prevCards.map(card => (card.id === cardId ? { ...card, deckId: newDeckId, question: newQuestion, answer: newAnswer } : card)));
    } catch (error) {
      console.error('Error updating card content:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      decks, cards, accuracy, progress, mostReviewedDeck,
      userId, signUp, logIn, logout,
      addDeck, removeDeck, addCard, removeCard,
      updateDeck, updateCardContent, logout, signUp, setCards,
      calculateAccuracy, calculateProgress, loadMetrics
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
