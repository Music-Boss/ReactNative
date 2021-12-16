import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MainPage from './MainPage';
import { useDispatch } from 'react-redux';
import {setEmail, setPassword} from '../slices/navSlice'
import { navSlice } from '../slices/navSlice';
import SignUpPage from './SignUpPage';

const LoginPage = () =>{
    const dispatch = useDispatch();
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
      <Image
            style={{ width: 150, height: 150, marginBottom: 15 }}
            source={require("../logomb.png")}
          />
        <Text style={styles.logo}>MusicBoss</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Email..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => dispatch(setEmail({
                text
            }))}/>
            
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => dispatch(setPassword({
                text
            }))}/>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate(MainPage)}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => navigation.navigate(SignUpPage)}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>

  
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#EABE3F",
    marginBottom:40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 5},
  inputView:{
    width:"80%",
    backgroundColor:"#1a2e6e",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"black",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#912427",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});

export default LoginPage