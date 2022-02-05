import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import OptionsMenu from "react-native-option-menu";
import { useNavigation } from '@react-navigation/native';
import SongsPage from './SongsPage'
import ListofListsfromRockola from './ListofListsfromRockola'
import { Icon } from 'react-native-elements'
import {setSongs, setNList, setLists, setEditList, setSongsList, setView} from '../slices/navSlice'
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import {selectUsername, selectToken, selectUserId, selectNoUser} from '../slices/navSlice'
import { useSelector } from 'react-redux';


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#912427', 
    accent: '#FF0606',
  },
};

var LeftContentLista = props => <Avatar.Icon {...props} theme={theme} icon="playlist-play"/> 

var LeftContentRockola = props => <Avatar.Icon {...props} theme={theme} icon="radio-tower"/> 

var DefaultCoverImage;

const myIcon = (<Icon style={{marginRight:10}}
  name='menu'
  type='Feather'
  color='#000000'
/>)

const getDefaultCoverImage = view => {
  var str;
  if(view == "Lobby"){
    return require("../list.jpg");
  } else {
    return require("../jukebox.jpg");
  }
}

const ListCard = ({lista, view, favorito, esFavorito}) => 
{
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const uid = useSelector(selectUserId);
  const nou = useSelector(selectNoUser);
  const editPost = () => {
    if(view == "Lobby"){
      dispatch(setEditList(lista));
      dispatch(setSongsList(lista.canciones));
      navigation.navigate('EditList');
    }
  }

  const deleteList = () =>{
    console.log("Delete List")
    var id = 0;
    var page = '';
    if(view == "Lobby"){
      id = lista.idLista
      page = 'listas'
      
    }
    else{
      id = lista.idRockola
      page = 'rockolas'
    }
    fetch('https://musicboss-app.herokuapp.com/api/'+page+'/'+id+'/', 
    {
        method: 'DELETE',
        headers: {
        'Content-Type':'application/json',  
        'Authorization':'Token '+token
        }
    })
    .then(response => {
      if (response.ok) {
      return response;
      }
      else {
      var error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      Alert.alert("No está autorizado a borrar esta lista!")
      throw error;
      }
  },
  error => {
    Alert.alert("No está autorizado a borrar esta lista!")
          throw error;
  })
  .then(response => {if(response.status == 204){
    if(view == "Lobby")
      Alert.alert("Lista borrada exitosamente!");
    else
      Alert.alert("Rockola borrada exitosamente!");
    

  }
  })
  .then(response => {
    if(view == "Lobby"){
    navigation.navigate('MyRockolas');
    navigation.navigate('MyLists');
    }
    else{
    navigation.navigate('MyLists');
    navigation.navigate('MyRockolas');      
    }
    

      console.log("response F:",response);
  }
  ).catch(error => console.log("Error", error));
  }

  const goToList = () => {
    if(view == "Lobby"){
      const songs = lista.canciones;
      console.log(songs);
      dispatch(setSongs(songs));
      const ln = lista.nombre;
      dispatch(setNList(ln));
      navigation.navigate('SongsPage');
    }
    else{
      const listas = lista.listas;
      console.log(listas);
      dispatch(setLists(listas));
      const ln = lista;
      dispatch(setNList(ln));
      dispatch(setView(view));
      navigation.navigate('ListofListsfromRockola',);
    }
  }

  const deleteList2 = () =>{
    console.log("Delete List")
    var id = 0;
    var page = '';
    if(view == "Lobby"){
      id = lista.idLista
      page = 'listas'
    }
    else{
      id = lista.idRockola
      page = 'rockolas'
    }
    fetch('https://musicboss-app.herokuapp.com/api/'+page+'/'+id+'/', 
    {
        method: 'DELETE',
        headers: {
        'Content-Type':'application/json',  
        'Authorization':'Token '+token
        }
    })
    .then(response => {
      if (response.ok) {
      return response;
      }
      else {
      var error = new Error('Error ' + response.status + ': ' + response.statusText);
      error.response = response;
      Alert.alert("No está autorizado a borrar esta lista!")
      throw error;
      }
  },
  error => {
    Alert.alert("No está autorizado a borrar esta lista!")
          throw error;
  })
  .then(response => {if(response.status == 204){
    if(view == "Lobby")
      Alert.alert("Lista borrada exitosamente!");
    else
      Alert.alert("Rockola borrada exitosamente!");
    

  }
  })
  .then(response => {
    if(view == "Lobby"){
    navigation.navigate('MyRockolas');
    navigation.navigate('MyLists');
    }
    else{
    navigation.navigate('MyLists');
    navigation.navigate('MyRockolas');      
    }
    

      console.log("response F:",response);
  }
  ).catch(error => console.log("Error", error));
  }
  
  return(

  <Card>
    <Card.Title title={lista.nombre} subtitle={lista.usuario == null ? "Usuario Anónimo" : "Creado por " + lista.usuario.username} left={view == "Rockola" || view=="MyRockola" || view == "RockolasFavoritos" ? LeftContentRockola : LeftContentLista } right={(props) => 
      nou == true ?
      <TouchableOpacity onPress={_ => {Alert.alert("Por favor cree una cuenta para poder agregar a favoritos!"); navigation.navigate('LoginPage')}}>
      <Icon style={{marginRight:10}}
        name='hearto'
        type='ant-design'
        color='#000000'
      />
      </TouchableOpacity>
      :
      favorito == true ?
        lista.usuario != null ?
        lista.usuario.id == uid ?
        <Icon style={{marginRight:10}}
            name='check'
            type='Entypo'
         /> :
        esFavorito == true ?
        <TouchableOpacity onPress={() => 
        {
          if(view == "Lobby" || view == "ListasFavoritos"){
            fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/listas/'+lista.idLista+'/', 
            {
              method: 'DELETE',
              headers: {
                'Content-Type':'application/json',  
                'Authorization':'Token '+token
              }
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
              if(view == "Lobby"){
                navigation.navigate('Rockolas');
                navigation.navigate('Lobby');
              }
              else{
                navigation.navigate('RockolasFavoritos');
                navigation.navigate('ListasFavoritos');                                
              }
            }
            ).catch(error => console.log("Error", error));
          
          }
                else{
                  
                            fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/rockolas/'+lista.idRockola+'/', 
                            {
                              method: 'DELETE',
                              headers: {
                                'Content-Type':'application/json',  
                                'Authorization':'Token '+token
                              }
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
                              if(view == "Rockola"){
                                navigation.navigate('Lobby');
                                navigation.navigate('Rockolas');
                              }
                              else{
                                navigation.navigate('ListasFavoritos');
                                navigation.navigate('RockolasFavoritos');                                
                              }
                            }
                            ).catch(error => console.log("Error", error));
                }
        }}> 
        <Icon style={{marginRight:10}}
        name='heart'
        type='ant-design'
        color='#000000'
      /> 
      </TouchableOpacity>
      : 
      <TouchableOpacity onPress={() => 
        {
          if(view == "Lobby")
          {
          
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/listas/'+lista.idLista+'/', 
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
                      }
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
                      navigation.navigate('Rockolas');
                      navigation.navigate('Lobby');
                    }
                    ).catch(error => console.log("Error", error));
                }
              else{
                
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/rockolas/'+lista.idRockola+'/', 
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
                      }
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
                      navigation.navigate('Lobby');
                      navigation.navigate('Rockolas');
                    }
                    ).catch(error => console.log("Error", error));

              }
        }}>
      <Icon style={{marginRight:10}}
        name='hearto'
        type='ant-design'
        color='#000000'
      />
      </TouchableOpacity>
      :
      esFavorito == true ?
        <TouchableOpacity onPress={() => 
        {
          if(view == "Lobby" || view == "ListasFavoritos"){
          
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/listas/'+lista.idLista+'/', 
                    {
                      method: 'DELETE',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
                      }
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
                      if(view == "Lobby"){
                        navigation.navigate('Rockolas');
                        navigation.navigate('Lobby');
                      }
                      else{
                        navigation.navigate('RockolasFavoritos');
                        navigation.navigate('ListasFavoritos');                        
                      }
                    }
                    ).catch(error => console.log("Error", error));
                }
                else{
                  
                            fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/rockolas/'+lista.idRockola+'/', 
                            {
                              method: 'DELETE',
                              headers: {
                                'Content-Type':'application/json',  
                                'Authorization':'Token '+token
                              }
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
                              if(view == "Rockola"){
                                navigation.navigate('Lobby');
                                navigation.navigate('Rockolas');
                              }
                              else{
                                navigation.navigate('ListasFavoritos');
                                navigation.navigate('RockolasFavoritos');                                
                              }
                            }
                            ).catch(error => console.log("Error", error));
                }
        }}> 
        <Icon style={{marginRight:10}}
        name='heart'
        type='ant-design'
        color='#000000'
      /> 
      </TouchableOpacity>
      : 
      <TouchableOpacity onPress={() => 
        {
          if(view == "Lobby")
          {
          
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/listas/'+lista.idLista+'/', 
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
                      }
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
                      navigation.navigate('Rockolas');
                      navigation.navigate('Lobby');
                    }
                    ).catch(error => console.log("Error", error));
                }
                else{
                  
                      fetch('https://musicboss-app.herokuapp.com/api/usuario/'+uid+'/fav/rockolas/'+lista.idRockola+'/', 
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type':'application/json',  
                          'Authorization':'Token '+token
                        }
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
                        navigation.navigate('Lobby');
                        navigation.navigate('Rockolas');
                      }
                      ).catch(error => console.log("Error", error));
  
                }
        }}>
      <Icon style={{marginRight:10}}
        name='hearto'
        type='ant-design'
        color='#000000'
      />
      </TouchableOpacity>
      :

      <OptionsMenu
        customButton={myIcon}
        destructiveIndex={1}
        options={["Editar", "Borrar", "Cancelar"]}
        actions={[editPost, deleteList]}/>}  />
   
    <Card.Content style = {{marginBottom: 20}}>
      <Title>Fecha de Creación</Title>
      <Paragraph>{lista.fechaCreacion}</Paragraph>
      
      
    </Card.Content>
    <TouchableOpacity onPress={() => goToList()}>
    <Card.Cover source={lista.cover == "" ? getDefaultCoverImage(view): {uri: 'https://img.youtube.com/vi/'+lista.cover+'/hqdefault.jpg'}} /> 
    

    </TouchableOpacity>
    {/*<Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
    */}
  </Card>
);
}

export default ListCard;