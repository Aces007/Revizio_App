import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAppContext } from '../AppContext';

const LoginSignUpScreen = ( { navigation } ) => {
  const { signUp, logIn } = useAppContext();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !username)) {
      Alert.alert("Please fill in the required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 7) {
      Alert.alert("Please enter a password with a minimum of 7 characters.");
      return;
    }

    if (!isLogin && username.length < 3) {
      alert('Username should be at least 3 characters long.');
      return;
    }

    try {
      if (isLogin) {
        await logIn(email, password);
        navigation.navigate('Home');
      } else {
        await signUp(email, username, password);
        navigation.navigate('Home');
      }
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Image source={require('./revizio.png')} style={styles.logoPNG}></Image>
        <Text style={styles.headerOne}>Welcome To Revizio</Text>
        <View style={styles.loginContainer}>
          <Text style={styles.headerTwo}>
            {isLogin ? 'Hi! Sign In to Your Account' : 'Let us get you on Board!'}
          </Text>
          <TextInput
            style={styles.inputFields}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {!isLogin && (
            <TextInput
              style={styles.inputFields}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}
          <TextInput
            style={styles.inputFields}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleAuth} style={styles.loginBtn}>
            <Text style={styles.loginBtnTxt}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.signUpBtn}>
            <Text style={styles.signUpBtnTxt}>
              {isLogin ? 'Switch to Sign Up' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFF8DC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  loginContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFAE5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2.5,
  },
  logoPNG: {
    width: 75,
    height: 75,
  },
  headerOne: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '800',
  },
  headerTwo: {
    fontSize: 21,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  inputFields: {
    width: '75%',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 8,
  },
  loginBtn: {
    backgroundColor: '#FFA500', 
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  loginBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signUpBtn: {
    backgroundColor: '#FFA500', 
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  signUpBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default LoginSignUpScreen;
