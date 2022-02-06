import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MainPage from './MainPage';
import { useDispatch } from 'react-redux';
import {setUsername, setEmail, setPassword, setPassword2, setLists, setToken, setNoUser} from '../slices/navSlice'
import { navSlice } from '../slices/navSlice';
import LoginPage from './LoginPage';
import Lobby from './Lobby';
import axios from 'axios';
import { SafeAreaView, ScrollView } from 'react-native';
import {selectUsername, selectEmail, selectPassword, selectPassword2} from '../slices/navSlice'
import { useRef, useEffect } from "react"
import { useSelector } from 'react-redux';

const SignUpPage = () =>{
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const selector = useSelector(selectUsername);
    const selector2 = useSelector(selectEmail);
    const selector3 = useSelector(selectPassword);
    const selector4 = useSelector(selectPassword2);    

    return (
      <ScrollView style = {styles.scrollView}>
      <View style={styles.container}>
        <Image
        style={{ width: 150, height: 150, marginBottom: 15 }}
        source={require("../logomb.png")}
        />
        <Text style={styles.logo}>MusicBoss</Text>
        <Text style={styles.logo2}>Registrarse</Text>
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
            placeholder="Contraseña..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => dispatch(setPassword({
                text
            }))}/>
        </View>
        <View style={styles.inputView} >
          <TextInput   
            secureTextEntry 
            style={styles.inputText}
            placeholder="Confirmar contraseña..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => dispatch(setPassword2({
                text
            }))}/>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Olvidaste la contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => 
        {
          const email = selector2;
          const username = selector;
          const password = selector3;
          const password2 = selector4;
          if(email == null || username == null || password == null || password2 == null){
            Alert.alert("Por favor. Completa todos los campos.");
          }
          else if(email.text == '' || username.text == '' || password.text == '' || password2.text == ''){
            Alert.alert("Por favor. Completa todos los campos.");
          }
          else if(password.text.length < 8){
            Alert.alert("La contraseña debe ser de al menos 8 carácteres.");
          }
          else if(password.text != password2.text){
            Alert.alert("Las contraseñas no coinciden.");
          }
          else{
            dispatch(setNoUser(false));
            const petition = '{"username":"'+ username.text+'","email":"'+email.text+'","password":"'+password.text+'"}';
            console.log("petition ", petition)
            fetch('https://musicboss-app.herokuapp.com/api/usuarios/', 
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
                Alert.alert("Por favor. Ingrese los campos correctamente.");
                throw error;

                }
            },
            error => {
                    throw error;
            })
            .then(response => response.json() )
            .then(response => {
              console.log("response ",response);
              if(response.username[0] == 'Ya existe un usuario con este nombre.'){
                Alert.alert("Ya existe un usuario con este nombre.");
              }
              else{
                var petitionfriends = '{"usuario":'+response.id+', "amigos":[]}'
                fetch('https://musicboss-app.herokuapp.com/api/usuario/info/', 
                {
                  method: 'POST',
                  headers: { 
                    'Content-Type':'application/json' 
                  },
                  body: petitionfriends
                });
                var petition = '{"username":"'+username.text+'", "password":"'+password.text+'"}'
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
                  dispatch(setToken(response));
                  Alert.alert("Usuario Creado Exitosamente!");
                  navigation.navigate('Lobby');
                }
                ).catch(error => console.log("Error", error));
                
              }
            }
            ).catch(error => console.log("Error", error));
          }
        }
        }>
        <Text style={styles.loginText}>REGISTRARSE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn}  onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
    marginBottom:20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -2, height: 2},
  textShadowRadius: 5},
  logo2:{
    fontWeight:"bold",
    fontSize:50,
    color:"#000000",
    marginBottom:40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
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
    marginBottom:1
  },
  loginText:{
    color:"white"
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 0,
  },
});

export default SignUpPage