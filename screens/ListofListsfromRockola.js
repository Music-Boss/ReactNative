import React, {Component} from 'react'
import { FlatList, StyleSheet, Text, View, Dimensions, Image, Button, TouchableOpacity, Alert } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import {selectLists, setNList} from '../slices/navSlice'
import { useSelector } from 'react-redux';
import {connect} from 'react-redux'
import Bottom from '../tabs/Bottom'
import YoutubePlayer from 'react-native-youtube-iframe'

const windowWidth = Dimensions.get('window').width;




class ListofListsfromRockola extends Component {

  constructor(props) {
    super(props);
    /*var DATA;
    axios.get('https://musicboss-app.herokuapp.com/api/listas/').then(
      response => {
        console.log(DATA);
        DATA = response.data;
      }
    );*/
    this.state = {
      loading: true,
      lista: null,
      rockola: this.props.rockola,
      token: this.props.token,
      idcanciones:[],
      playlist: []
    };
    //this.arrayholder = DATA;
  }

  componentDidMount() {
    this.state.lista = this.state.rockola.listas[0];
    for(let i = 0; i < this.state.rockola.canciones.length; i++){
      this.state.idcanciones = [...this.state.idcanciones, this.state.rockola.canciones[i].idCancion]
      this.state.playlist = [...this.state.playlist, this.state.rockola.canciones[i].fuente]
    }
    for(let j = 0; j < this.state.lista.canciones.length; j++){
      console.log("lista ", this.state.idcanciones.indexOf(this.state.lista.canciones[j].idCancion))
    }         
    this.state.loading = false;
    this.forceUpdate()
  }

  renderItem = ({item}) => {
    return (
      <Card style={{width : windowWidth, marginTop: 20}}>
          <Card.Title title={item.nombre} subtitle={item.artista} />
          <Card.Content>
          <Paragraph></Paragraph>
          
          </Card.Content>
            <Card.Cover source={{ uri: 'https://img.youtube.com/vi/'+item.fuente+'/hqdefault.jpg'}} />
          {/*<Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
          </Card.Actions>
          */}
          <TouchableOpacity
            style={styles.loginBtn}
            disabled = {this.state.idcanciones.indexOf(item.idCancion) > -1 ? true : false}
                          onPress={() => {
                                fetch('https://musicboss-app.herokuapp.com/api/rockola/'+this.state.rockola.idRockola+'/canciones/add/'+item.idCancion+'/', 
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type':'application/json',  
                                    'Authorization':'Token '+this.state.token
                                  }
                                })
                                .then(response => {
                                  if (response.ok) {
                                    Alert.alert("Rockola Editada");
                                    console.log("response ", response)
                                    fetch('https://musicboss-app.herokuapp.com/api/rockolas/'+this.state.rockola.idRockola+'/', 
                                    {
                                      method: 'GET',
                                      headers: {
                                        'Content-Type':'application/json'
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
                                      console.log("response add song ", response)
                                      this.state.rockola = response;
                                      this.state.lista = this.state.rockola.listas[0];
                                      this.state.idcanciones = [...this.state.idcanciones, item.idCancion]
                                      this.forceUpdate();
                                      
                                    })
                                    .catch(error => console.log("Error", error));
                                    return response;
                                  }
                                  else {
                                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                                    error.response = response;
                                    Alert.alert("Rockola No Pudo Ser Editada");
                                    throw error;
                                    }
                                },
                                error => {
                                        throw error;
                                })
                                .catch(error => console.log("Error", error));
                              
                            
                          }}
                        >
                          <Text style={styles.loginText}>Agregar a lista de reproducción.</Text>
                      </TouchableOpacity>
      </Card>
    )
  }

  render(){
    if(this.state.loading){
      return(
        <View>
          <Text style= {{textAlign : "center", fontSize:20, marginTop:20}}>
            Cargando...
          </Text>

        </View>
      )
    }

    return (
      <View style={{flex:1}}>
      <View>
      <Text style= {{textAlign : "center", fontSize:20, marginTop:25}}>
        {this.state.rockola.nombre}
      </Text>
      
      <View style ={{marginTop: 15}}>
      <Text style= {{textAlign : "center", fontSize:20}}>
        Lista de canciones de lista {this.state.lista.nombre}.
      </Text>
      <Carousel 
        layout={"default"}
        data={this.state.lista.canciones}
        sliderWidth={400}
        itemHeight={700}
        itemWidth={400}
        sliderHeight={700}
        renderItem={this.renderItem}
      />
       
      </View>

      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop:5 }} nestedScrollEnabled>
        <View style={styles.container}>
        
        
          
          <FlatList
            style={{flex:0}} 
            data={this.state.rockola.listas}
            renderItem={
              ({item}) =>
              <Button
              title = {item.nombre}
              onPress ={() => {this.state.lista = item; this.forceUpdate()}}
              disabled = {this.state.lista == item ? true : false} 
              />
            }     
            keyExtractor={(item) => item.idLista}
            
          />
            
          
        
          <Text style= {{textAlign : "center", fontSize:20}}>
            Lista de reproducción.
          </Text>

      

           <FlatList
                  scrollEnabled={false}
                  style={{flex: 0 }} 
                  data={this.state.rockola.canciones}
                  renderItem={
                    ({item}) => 
                    <View style={styles.checkboxContainer}>
                      
                    
    
                    
                    <Card style={{width: windowWidth, marginRight:20}}>
                    <Card.Title title={item.nombre} subtitle={item.artista} left={(props) => <Image source={{uri: 'https://img.youtube.com/vi/'+item.fuente+'/hqdefault.jpg'}} style={[{width:50, height:50}]} />} right={(props) => 
                    <TouchableOpacity
                        onPress={() => {
                              fetch('https://musicboss-app.herokuapp.com/api/rockola/'+this.state.rockola.idRockola+'/canciones/remove/'+item.idCancion+'/', 
                              {
                                method: 'DELETE',
                                headers: {
                                  'Content-Type':'application/json',  
                                  'Authorization':'Token '+this.state.token
                                }
                              })
                              .then(response => {
                                if (response.ok) {
                                  Alert.alert("Rockola Editada");
                                  fetch('https://musicboss-app.herokuapp.com/api/rockolas/'+this.state.rockola.idRockola+'/', 
                                  {
                                    method: 'GET',
                                    headers: {
                                      'Content-Type':'application/json'
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
                                    
                                    this.state.rockola = response;
                                    this.state.lista = this.state.rockola.listas[0];
                                    for(let i = 0; i < this.state.rockola.canciones.length; i++){
                                      this.state.idcanciones = [...this.state.idcanciones, this.state.rockola.canciones[i].idCancion]
                                      this.state.playlist = [...this.state.playlist, this.state.rockola.canciones[i].fuente]
                                    }
                                    this.forceUpdate();
                                  })
                                  .catch(error => console.log("Error", error));
                                  return response;
                                }
                                else {
                                  var error = new Error('Error ' + response.status + ': ' + response.statusText);
                                  error.response = response;
                                  Alert.alert("Rockola No Pudo Ser Editada");
                                  throw error;
                                  }
                              },
                              error => {
                                      throw error;
                              })
                              .catch(error => console.log("Error", error));
                            
                          
                        }}
                      >
                        <Text style={{marginRight:20}}>Eliminar</Text>
                    </TouchableOpacity>
                    }/>
                    
                    
                    {/*<Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                    </Card.Actions>
                    */}
                    </Card>
                    </View>
                  }     
                  keyExtractor={(item) => item.idCancion}
                />
        
          
          
            
          
        </View>
      </ScrollView>
      <View>
        {
          this.state.playlist.length == 0 ?
          <View></View>
          :
        <YoutubePlayer
        height={2}
        play={true}
        playList={this.state.playlist}
        />
        }
      <Bottom data = {[
            {
                id: "0",
                title: "Explorar",
                image: "https://img.icons8.com/ios-glyphs/60/ffffff/news.png",
                screen: "Lobby",
                disabled: "true"
            },
            {
                id:"1",
                title:"Mis Listas",
                image: "https://img.icons8.com/ios-glyphs/60/ffffff/playlist--v1.png",
                screen: "MyLists", // Change in future....
            },
            {
              id:"2",
              title:"Favoritos",
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/online-shop-favorite.png",
              screen: "ListasFavoritos", // Change in future....
            },
            {
              id:"3",
              title:"Perfil",
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/guest-male.png",
              screen: "User", // Change in future....
            },
             ]}/>
      </View>


      </View>
  )
  }
}

const mapStateToProps = state => {
  return {
      token: state.nav.token,
      currUsername: state.nav.username,
      uid: state.nav.userid,
      rockola: state.nav.nList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setRockola: (rockola) => dispatch(setNList(rockola))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListofListsfromRockola);


const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 2,
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#912427",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10,
    marginLeft: 30
  },
  loginText:{
    color:"white"
  }
});
