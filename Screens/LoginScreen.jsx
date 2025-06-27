import React, { useState, useContext } from 'react';
import loginImg from "../assests/Login/registration.png";
import { AtSign } from 'lucide-react-native';
import { LockKeyhole } from 'lucide-react-native';
import { EyeOff } from 'lucide-react-native';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [secure, setSecure] = useState(true);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'All fields are required');
    }

    try {
      const res = await axios.post(
        'https://reqres.in/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres-free-v1',
          },
        }
      );

      await AsyncStorage.setItem('token', res.data.token);
      login(); // Trigger AuthContext update
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Unknown Error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>

      <Image source={loginImg} style={styles.image} />

      <Text style={styles.heading}>Login</Text>

        <View style={styles.inputContainer}>
        <AtSign size={20}  style={styles.icon} />
          {/* <Icon name="email" size={20} color="#999" style={styles.icon} /> */}
          <TextInput
            placeholder="Email ID"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
            <LockKeyhole  style={styles.icon}  />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
<EyeOff  style={styles.icon}/>          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>




       
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    inner: {
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    heading: {
      fontSize: 28,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      width: '100%',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 5,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
    },
    icon: {
      marginRight: 10,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 20,
    },
    forgotText: {
      color: '#007BFF',
    },
    loginButton: {
      backgroundColor: '#007BFF',
      width: '100%',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    loginText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    orText: {
      marginBottom: 10,
      fontSize: 16,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    googleText: {
      fontSize: 16,
    },
    registerWrapper: {
      flexDirection: 'row',
      marginTop: 20,
    },
    registerText: {
      color: '#007BFF',
      fontWeight: 'bold',
    },
  });
  