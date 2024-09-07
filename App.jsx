import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AppProvider, useAppContext } from "./AppContext"; 
import "@react-navigation/stack";
import "react-native-gesture-handler";
import DeckScreen from "./screens/DeckScreen";
import CardScreen from "./screens/CardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DeckDetailScreen from "./screens/DeckDetailScreen";
import QuizScreen from "./screens/QuizScreen";
import QuizResult from "./screens/QuizResult";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoginSignUpScreen from "./screens/LoginSignUpScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconComponent;

          if (route.name === 'Decks') {
            iconComponent = 
            iconName = focused ? 'book' : 'book';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'credit-card' : 'credit-card';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { height: 60, backgroundColor: '#FFF8DC', paddingBottom: 5 } ,
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Decks" component={DeckScreen} />
      <Tab.Screen name="Cards" component={CardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainApp() {
  const {userId, loading } = useAppContext();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={userId ? "Home" : 'LoginSignUpScreen'}>
      <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="LoginSignUpScreen" component={LoginSignUpScreen} options={{headerShown: false}}/>
      <Stack.Screen name="DeckDetailScreen" component={DeckDetailScreen}/>
      <Stack.Screen name="QuizScreen" component={QuizScreen}/>
      <Stack.Screen name="QuizResult" component={QuizResult}/>
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <AppProvider> 
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AppProvider>
  );
}
