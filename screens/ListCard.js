import * as React from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import OptionsMenu from "react-native-option-menu";
import { useNavigation } from '@react-navigation/native';
import SongsPage from './SongsPage'
import ListofListsfromRockola from './ListofListsfromRockola'
import { Icon } from 'react-native-elements'
import {setSongs, setNList, setLists, setEditList, setSongsList} from '../slices/navSlice'
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import {selectUsername, selectToken, selectUserId} from '../slices/navSlice'
import { useSelector } from 'react-redux';


const LeftContent = props => <Avatar.Icon {...props} icon="playlist-play" />

const myIcon = (<Icon
  name='menu'
  type='Feather'
  color='#000000'
/>)



const ListCard = ({lista, view, favorito, esFavorito}) => 
{
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const uid = useSelector(selectUserId);
  const editPost = () => {
    if(view == "Lobby"){
      dispatch(setEditList(lista));
      dispatch(setSongsList(lista.canciones));
      navigation.navigate('EditList');
    }
  }

  const deleteList = () =>{
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
      navigation.navigate('ListofListsfromRockola');
    }
  }
  
  return(

  <Card>
    <Card.Title title={lista.nombre} subtitle={lista.usuario == null ? "Usuario Anónimo" : "Creado por " + lista.usuario.username} left={LeftContent} right={(props) => 
      favorito == true ?
        lista.usuario != null ?
        lista.usuario.id == uid ?
        <Icon
            name='check'
            type='Entypo'
         /> :
        esFavorito == true ?
        <TouchableOpacity onPress={() => 
        {
          if(view == "Lobby" || view == "ListasFavoritos"){
          var listaids = [];
          fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                    for(let i = 0; i < response.fav_listas.length; i++){
                      listaids = [...listaids, response.fav_listas[i].idLista]
                    }
                  })
                  .then(response => {
                    console.log("response ",response);
                    var petition = '{"fav_listas":['
                    var count = 0
                    for(let i = 0; i < listaids.length; i++){
                      if(listaids[i] != lista.idLista){
                        petition = petition + listaids[i]+', '
                        count = count + 1
                      }
                    }
                    if(count > 0)
                      petition = petition.slice(0,-2);
                    petition = petition + ']}'
                    console.log("petition:", petition)
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
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
                  ).catch(error => console.log("Error", error));
                }
                else{
                  var listaids = [];
                  fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                            for(let i = 0; i < response.fav_rockolas.length; i++){
                              listaids = [...listaids, response.fav_rockolas[i].idRockola]
                            }
                          })
                          .then(response => {
                            console.log("response ",response);
                            var petition = '{"fav_rockolas":['
                            var count = 0;
                            for(let i = 0; i < listaids.length; i++){
                              if(listaids[i] != lista.idRockola){
                                petition = petition + listaids[i]+', '
                                count = count + 1;
                              }
                            }
                            if(count > 0)
                              petition = petition.slice(0,-2);
                            petition = petition + ']}'
                            console.log("petition:", petition)
                            fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                            {
                              method: 'PATCH',
                              headers: {
                                'Content-Type':'application/json',  
                                'Authorization':'Token '+token
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
                          ).catch(error => console.log("Error", error));
                }
        }}> 
        <Icon
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
          var listaids = [];
          fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                    for(let i = 0; i < response.fav_listas.length; i++){
                      listaids = [...listaids, response.fav_listas[i].idLista]
                    }
                  })
                  .then(response => {
                    console.log("response ",response);
                    var petition = '{"fav_listas":['
                    for(let i = 0; i < listaids.length; i++){
                      petition = petition + listaids[i]+', '
                    }
                    petition = petition + lista.idLista
                    petition = petition + ']}'
                    console.log("petition:",petition)
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
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
                      navigation.navigate('Rockolas');
                      navigation.navigate('Lobby');
                    }
                    ).catch(error => console.log("Error", error));
                  }
                  ).catch(error => console.log("Error", error));
                }
              else{
                var listaids = [];
                fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                    for(let i = 0; i < response.fav_rockolas.length; i++){
                      listaids = [...listaids, response.fav_rockolas[i].idRockola]
                    }
                  })
                  .then(response => {
                    console.log("response ",response);
                    var petition = '{"fav_rockolas":['
                    for(let i = 0; i < listaids.length; i++){
                      petition = petition + listaids[i]+', '
                    }
                    petition = petition + lista.idRockola
                    petition = petition + ']}'
                    console.log("petition:",petition)
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
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
                      navigation.navigate('Lobby');
                      navigation.navigate('Rockolas');
                    }
                    ).catch(error => console.log("Error", error));
                  }
                  ).catch(error => console.log("Error", error));

              }
        }}>
      <Icon
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
          var listaids = [];
          fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                    for(let i = 0; i < response.fav_listas.length; i++){
                      listaids = [...listaids, response.fav_listas[i].idLista]
                    }
                  })
                  .then(response => {
                    console.log("response ",response);
                    var petition = '{"fav_listas":['
                    var count = 0
                    for(let i = 0; i < listaids.length; i++){
                      if(listaids[i] != lista.idLista){
                        petition = petition + listaids[i]+', '
                        count = count + 1
                      }
                    }
                    if(count > 0)
                      petition = petition.slice(0,-2);
                    petition = petition + ']}'
                    console.log("Petition ", petition)
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
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
                  ).catch(error => console.log("Error", error));
                }
                else{
                  var listaids = [];
                  fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                            for(let i = 0; i < response.fav_rockolas.length; i++){
                              listaids = [...listaids, response.fav_rockolas[i].idRockola]
                            }
                          })
                          .then(response => {
                            console.log("response ",response);
                            var petition = '{"fav_rockolas":['
                            var count = 0
                            for(let i = 0; i < listaids.length; i++){
                              if(listaids[i] != lista.idRockola){
                                petition = petition + listaids[i]+', '
                                count = count + 1
                              }
                            }
                            if(count > 0)
                              petition = petition.slice(0,-2);
                            petition = petition + ']}'
                            console.log("petition:", petition)
                            fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                            {
                              method: 'PATCH',
                              headers: {
                                'Content-Type':'application/json',  
                                'Authorization':'Token '+token
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
                          ).catch(error => console.log("Error", error));
                }
        }}> 
        <Icon
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
          var listaids = [];
          fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                    for(let i = 0; i < response.fav_listas.length; i++){
                      listaids = [...listaids, response.fav_listas[i].idLista]
                    }
                  })
                  .then(response => {
                    console.log("response ",response);
                    var petition = '{"fav_listas":['
                    for(let i = 0; i < listaids.length; i++){
                      petition = petition + listaids[i]+', '
                    }
                    petition = petition + lista.idLista
                    petition = petition + ']}'
                    console.log("petition:",petition)
                    fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type':'application/json',  
                        'Authorization':'Token '+token
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
                      navigation.navigate('Rockolas');
                      navigation.navigate('Lobby');
                    }
                    ).catch(error => console.log("Error", error));
                  }
                  ).catch(error => console.log("Error", error));
                }
                else{
                  var listaids = [];
                  fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/')
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
                      for(let i = 0; i < response.fav_rockolas.length; i++){
                        listaids = [...listaids, response.fav_rockolas[i].idRockola]
                      }
                    })
                    .then(response => {
                      console.log("response ",response);
                      var petition = '{"fav_rockolas":['
                      for(let i = 0; i < listaids.length; i++){
                        petition = petition + listaids[i]+', '
                      }
                      petition = petition + lista.idRockola
                      petition = petition + ']}'
                      console.log("petition:",petition)
                      fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+uid+'/', 
                      {
                        method: 'PATCH',
                        headers: {
                          'Content-Type':'application/json',  
                          'Authorization':'Token '+token
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
                        navigation.navigate('Lobby');
                        navigation.navigate('Rockolas');
                      }
                      ).catch(error => console.log("Error", error));
                    }
                    ).catch(error => console.log("Error", error));
  
                }
        }}>
      <Icon
        name='hearto'
        type='ant-design'
        color='#000000'
      />
      </TouchableOpacity>
      :

      <OptionsMenu
        customButton={myIcon}
        destructiveIndex={1}
        options={["Editar","Borrar"]}
        actions={[editPost, deleteList]}/>}  />
   
    <Card.Content style = {{marginBottom: 20}}>
      <Title>Fecha de Creación</Title>
      <Paragraph>{lista.fechaCreacion}</Paragraph>
      
      
    </Card.Content>
    <TouchableOpacity onPress={() => goToList()}>
    <Card.Cover source={[lista.cover == "" ? { uri: 'https://picsum.photos/id/145/500' }:{uri: 'https://img.youtube.com/vi/'+lista.cover+'/hqdefault.jpg'}]} />
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