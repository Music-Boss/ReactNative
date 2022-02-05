import React, {Component} from 'react'
import { FlatList, StyleSheet, Text, View, Dimensions, Image, Button, TouchableOpacity, Alert, Pressable } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import {selectLists, setNList} from '../slices/navSlice'
import { useSelector } from 'react-redux';
import {connect} from 'react-redux'
import Bottom from '../tabs/Bottom'
import YoutubePlayer from 'react-native-youtube-iframe'

const windowWidth = Dimensions.get('window').width;

function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
}

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

    console.log("props-list:", this.props.view);

    this.state = {
      loading: true,
      lista: null,
      rockola: null,
      idrockola: this.props.rockola.idRockola,
      token: this.props.token,
      idcanciones:[],
      playlist: []
    };
    //this.arrayholder = DATA;
  }

  componentDidMount() {
    this.state.loading = true;
    fetch('https://musicboss-app.herokuapp.com/api/rockolas/'+this.state.idrockola+'/')
    .then(res => {return res.json()})
    .then(res => {this.state.rockola = res})
    .then(res => {
      console.log('rockola inicial:',this.state.rockola)
      this.state.lista = this.state.rockola.listas[0];
      for(let i = 0; i < this.state.rockola.canciones.length; i++){
        this.state.idcanciones = [...this.state.idcanciones, this.state.rockola.canciones[i].idCancion]
        this.state.playlist = [...this.state.playlist, this.state.rockola.canciones[i].fuente]
      }
      for(let j = 0; j < this.state.lista.canciones.length; j++){
        console.log("lista ", this.state.idcanciones.indexOf(this.state.lista.canciones[j].idCancion))
      }
      console.log("PLAYLIST: ", this.state.playlist)
      this.state.loading = false;
      this.forceUpdate();
    }) 
  }

  renderItem = ({item}) => {
    return (
      <Card style={{width : windowWidth/2, alignSelf:"center", marginTop: 10}}>
          <Card.Title title={item.nombre} subtitle={item.artista} />
          <Card.Content>
          
          </Card.Content>
            <Card.Cover style={{margin:0}}source={{ uri: 'https://img.youtube.com/vi/'+item.fuente+'/hqdefault.jpg'}} />
          {/*<Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
          </Card.Actions>
          */}
          <TouchableOpacity
            style={this.state.idcanciones.indexOf(item.idCancion) > -1 ? styles.loginBtnDisabled : styles.loginBtn }
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
                                        Alert.alert("Rockola No Pudo Ser Editada");
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
                                      this.state.idcanciones = [];
                                      this.state.playlist = [];
                                      for(let i = 0; i < this.state.rockola.canciones.length; i++){
                                        this.state.idcanciones = [...this.state.idcanciones, this.state.rockola.canciones[i].idCancion]
                                        this.state.playlist = [...this.state.playlist, this.state.rockola.canciones[i].fuente]
                                      }

                                      this.props.setRockola(response);
                                      //this.props.navigation.navigate('MyRockolas');
                                      //this.props.navigation.navigate('ListofListsfromRockola');
                                      this.forceUpdate();
                                      this.componentDidMount();
                                      
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
                        {this.state.idcanciones.indexOf(item.idCancion) > -1 ?
                          <Text style={styles.loginText}>Agregada</Text>
                        :
                        
                        <>
                        <Text style={styles.loginText}>Agregar a lista de</Text>
                        <Text style={styles.loginText}>reproducción</Text>
                        </>

                        }
                          
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
      <View style={{flex:1, flexDirection:"column"}}>
      <Text style= {{textAlign : "center", fontWeight:"bold", fontSize:25, marginTop:30}}>
        {this.state.rockola.nombre}
      </Text>
      <ScrollView style={{minHeight:200}} nestedScrollEnabled>

      <View style ={{marginTop: 5}}>

      <FlatList
            style={{flex:0, height:125}} 
            data={this.state.rockola.listas}
            renderItem={
              ({item}) =>
              <Pressable style={this.state.lista == item ? styles.listBtnSelected: styles.listBtn }
              onPress ={() => {this.state.lista = item; this.forceUpdate()}}
              >
              <Text style={{alignSelf:"center", fontSize:15, color:"#ffffff"}}>{item.nombre}</Text>
              </Pressable>
            }     
            keyExtractor={(item) => item.idLista}
            
          nestedScrollEnabled/>
      <View style={{minHeight:200}}>
      <Carousel 
        layout={"default"}
        data={this.state.lista.canciones}
        sliderWidth={400}
        itemHeight={700}
        itemWidth={200}
        sliderHeight={700}
        renderItem={this.renderItem}
      />
       
      </View>
      

      </View>      
      </ScrollView>

      <Text style= {{textAlign : "center", fontWeight:"bold", fontSize:20, margin:5}}>
            Lista de reproducción
      </Text>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop:5, minHeight:160 }} nestedScrollEnabled>
        <View>
        
        
          

      

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
                                    console.log("song eliminated:", this.state.rockola)
                                    this.state.lista = this.state.rockola.listas[0];
                                    this.state.idcanciones = [];
                                    this.state.playlist = [];
                                    for(let i = 0; i < this.state.rockola.canciones.length; i++){
                                      this.state.idcanciones = [...this.state.idcanciones, this.state.rockola.canciones[i].idCancion]
                                      this.state.playlist = [...this.state.playlist, this.state.rockola.canciones[i].fuente]
                                    }
                                    this.props.setRockola(response);
                                    //this.props.navigation.navigate('MyRockolas');
                                    //this.props.navigation.navigate('ListofListsfromRockola');
                                    this.forceUpdate();
                                    this.componentDidMount();
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
          this.state.playlist.length == 0 || this.state.loading ?
          <View></View>
          :
        <YoutubePlayer
        height={1}
        play={true}
        //autoplay={true}
        webViewStyle={ {opacity:0.01} } //Esta linea corrige el error cuando va a otra vista y vuelve a la rockola
        playList={this.state.playlist}
        />
        }
      <Bottom data = {[
            {
                id: "0",
                title: "Explorar",
                image: "https://img.icons8.com/ios-glyphs/60/ffffff/news.png",
                screen: "Lobby",
                disabled: this.props.view === "Rockola" ? "true" : "false"
            },
            {
                id:"1",
                title:"Mis Listas",
                image: "https://img.icons8.com/ios-glyphs/60/ffffff/playlist--v1.png",
                screen: "MyLists", // Change in future....
                disabled: this.props.view === "MyRockola" ? "true" : "false"
            },
            {
              id:"2",
              title:"Favoritos",
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/online-shop-favorite.png",
              screen: "ListasFavoritos", // Change in future....
              disabled: this.props.view === "RockolasFavoritos" ? "true" : "false"
            },
            {
              id:"3",
              title:"Perfil",
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/arms-up.png", 
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
      rockola: state.nav.nList,
      view: state.nav.currView
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
    backgroundColor: "#912427",
    alignSelf:"center",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10,
    marginLeft: 30,
    marginRight: 30,
  },
  loginBtnDisabled:{
    width:"80%",
    backgroundColor: "#787878",
    alignSelf:"center",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10,
    marginLeft: 30,
    marginRight: 30,
  },
  listBtn:{ 
    borderRadius:25, 
    backgroundColor:"#912427", 
    padding:5, 
    marginBottom:5
  },
  listBtnSelected:{ 
    borderRadius:25, 
    backgroundColor:"#BA3437", 
    padding:5, 
    marginBottom:5
  },
  loginText:{
    color:"white",
  }
});
