import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Alert ,StyleSheet, Text, View, TextInput, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MainPage from './MainPage';
import { useDispatch } from 'react-redux';
import {setUsername, setPassword, setToken, setNoUser} from '../slices/navSlice'
import { navSlice } from '../slices/navSlice';
import SignUpPage from './SignUpPage';
import {selectUsername} from '../slices/navSlice'
import {selectPassword} from '../slices/navSlice'
import { useRef, useEffect } from "react"
import { useSelector } from 'react-redux';
import Lobby from './Lobby';




const LoginPage = () =>{
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const username = useSelector(selectUsername);
    const pword = useSelector(selectPassword);

    const login = () => {
      dispatch(setNoUser(false));
      console.log(JSON.stringify({
        username: username,
        password: pword
      }));
      var petition = JSON.stringify({
        username: username,
        password: pword
      });
      petition = petition.replace('{"text":','');
      petition = petition.replace('{"text":','');
      petition = petition.replace('},',',');
      petition = petition.replace('}}','}');
      console.log("petition ", petition)
      
      fetch('https://musicboss-app.herokuapp.com/api/login/', 
      {
        method: 'POST',
        headers: { 
          'Content-Type':'application/json' 
        },
        body: petition
      })
      .then(response => {
        if (response.ok) {
          return response;
        }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
          }
      },
      error => {
              throw error;
      })
      .then(response => response.json() )
      .then(response => {
        console.log("response ",response);
        if(response == 'Contraseña incorrecta'){
          Alert.alert("Contraseña Incorrecta.");
        }
        else if(response == 'Usuario inválido'){
          Alert.alert("Usuario inválido.");
        }
        else{
          dispatch(setToken(response));
          navigation.navigate('Lobby');
        }
      }
      ).catch(error => console.log("Error", error));
      
    }
  
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
            placeholder="Nombre de Usuario..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => dispatch(setUsername({
                text
            }))}/>
            
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Contraseña..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => dispatch(setPassword({
                text
            }))}/>
        </View>
        <TouchableOpacity>
          <Text style={{color:"black"}}>¿Olvidaste la contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => login()}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => navigation.navigate(SignUpPage)}>
          <Text style={styles.loginText}>REGISTRARSE</Text>
        </TouchableOpacity>
        <Text style={{color:"black", marginTop:10}}>O puedes acceder a funciones básicas sin una cuenta</Text>
        <TouchableOpacity onPress={() => {dispatch(setNoUser(true));navigation.navigate('Lobby')}}>
          <Text style={{color:"red", textDecorationLine:"underline"}}>aquí</Text>
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