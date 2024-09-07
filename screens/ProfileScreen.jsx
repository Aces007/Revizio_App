import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext } from '../AppContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { supabase } from '../supabaseClient';

const ProfileScreen = ({ navigation }) => {
  const { decks, cards, mostReviewedDeck, userId, logout, loadMetrics, accuracy, progress } = useAppContext();
  const [user, setUser] = useState(null);
  
  const overallProgress = progress;

  useEffect(() => {
    if (userId) {
      loadMetrics(userId);
    }
  }, [userId]);

  const handleLogout = () => {
    Alert.alert(
      "Log Out", 
      "Are you sure you want to log out?", 
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: async () => {
            await logout(),
          navigation.navigate("LoginSignUpScreen")
          }
        }
      ]
    );
  };

  return (
    <View style={styles.profile_cont}>
      <View style={styles.profile_header}>
        <Text style={styles.headerText}>Your Stats</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleLogout}>
          <AntDesign name='logout' size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollViewer}>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
        <View style={styles.mainStats_cont}>
          <View style={styles.stats_contBox}>
            <FontAwesome name='tasks' size={40} color='#71797E' />
            <Text style={styles.stat_txtLabel}>Total Decks</Text>
            <Text style={styles.stat_txt}>{decks.length} Decks</Text>
          </View>
          <View style={styles.stats_contBox}>
            <MaterialCommunityIcons name='cards-playing' size={40} color='#71797E' />
            <Text style={styles.stat_txtLabel}>Total Cards</Text>
            <Text style={styles.stat_txt}>{cards.length} Cards</Text>
          </View>
        </View>
        <View style={styles.singleStat}>
          <Text style={styles.statTxtLabel}>Total Accuracy</Text>
          <Text style={styles.statTxt}>{accuracy}%</Text>
        </View>
        <View style={styles.singleStat}>
          <Text style={styles.mostDeckTxtLabel}>Most Reviewed Deck</Text>
          <Text style={styles.mostDeckTxt}>{mostReviewedDeck}</Text>
        </View>
        <View style={styles.singleStat}>
          <Text style={styles.progressLabel}>Learning Progress</Text>
          {decks.map(deck => (
            <View key={deck.id} style={styles.deckProgressContainer}>
              <Text style={styles.deck_names}>{deck.name}</Text>
              <Text style={styles.progressText}>
                Progress: {overallProgress.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewer: {
    padding: 5,
    backgroundColor: '#FFF8DC',
    flexGrow: 1,
  },
  profile_cont: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8DC',
    paddingTop: 40,
  },
  profile_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B2E2A'
  },
  addButton: {
    alignSelf: 'flex-end',
    color: '#000',
    marginBottom: 20,
  },
  setting_Btn: {
    borderWidth: 18,
    marginRight: 5,
  },
  mainStats_cont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats_contBox: {
    backgroundColor: '#FFFAE5',
    paddingVertical: 50,
    paddingHorizontal: 35,
    borderRadius: 8,
    alignItems: 'center',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  stat_txtLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  stat_txt: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  singleStat: {
    backgroundColor: '#FFFAE5',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 8,
    alignItems: 'center',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statTxtLabel: {
    fontWeight: '800',
  },
  statTxt: {
    fontWeight: '700',
  },
  mostDeckTxtLabel: {
    fontWeight: '800',
  },
  mostDeckTxt: {
    fontWeight: '700',
  },
  progressLabel: {
    fontWeight: '800',
  },
  deck_names: {
    fontWeight: '800',
    color: '#71797E',
  },
  deckProgressContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  progressText: {
    fontWeight: '700',
    marginTop: 5,
  },
});

export default ProfileScreen;
