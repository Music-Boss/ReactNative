import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, FlatList, SafeAreaView, TextInput, TouchableOpacity, Modal, Image } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";
import axios from 'axios' 
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { ScrollView } from "react-native-gesture-handler";
import ListCard from "./ListCard";
import Tabs from "../tabs/Tabs" 
import Bottom from "../tabs/Bottom" 
import {connect} from 'react-redux'
import CheckBox from 'react-native-check-box'
import {setUserId, setAllLists} from '../slices/navSlice'
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements'

const windowWidth = Dimensions.get('window').width;

class EditList extends Component {

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
          loading: false,
          error: null,
          searchValue: "",
          token: "",
          canciones: [],
          cancionesquery:[],
          urlCanciones: "https://musicboss-app.herokuapp.com/api/canciones/",
          nombreLista: this.props.editList.nombre,
          cancionesMarcadas: [],
          cancionesYaAgregadas: this.props.songsList,
          count: 0,
          urlUsuarios: "https://musicboss-app.herokuapp.com/api/usuarios/",
          usuarios: [],
          currUsername: this.props.currUsername,
          userId: null,
          uid: this.props.uid,
          imagenMarcadas: "",
          cover: this.props.editList.cover,
          listaId: this.props.editList.idLista,
          nuevoNombre: ""
        };
        //this.arrayholder = DATA;
      }
    
      
      
      componentDidMount(){
        this.props.navigation.addListener('focus', () => {
          this.getListas();
        });
      }  
    
      getListas = () => {
        this.setState({ loading:true} );    
        
        
    
        this.state.token = this.props.token;
        this.state.imagenMarcadas = "";
        console.log("token ", this.state.token);
    
        fetch(this.state.urlCanciones)
        .then(res => {
          console.log("res raws canciones: "+res);
          return res.json()})
        .then(res => {
          this.setState({
            canciones: res,
            cancionesquery:res
          })
          console.log("res json canciones: " +res);
        })
        .then(_ => {
          console.log("length: ", this.state.canciones.length);
          console.log("canciones ya agregadas:",this.state.cancionesYaAgregadas)
          for(let i = 0; i < this.state.canciones.length; i++){
            this.state.cancionesMarcadas = [...this.state.cancionesMarcadas, false]
          };
          for(let i = 0; i < this.state.cancionesYaAgregadas.length; i++){
            for(let j = 0; j < this.state.canciones.length; j++){
              if(this.state.cancionesYaAgregadas[i].idCancion == this.state.canciones[j].idCancion){
                console.log("True");
                this.state.canciones.splice(j, 1);
                this.state.cancionesMarcadas.splice(j,
                  );
                this.state.canciones = [this.state.cancionesYaAgregadas[i], ...this.state.canciones];
                this.state.cancionesMarcadas = [true, ...this.state.cancionesMarcadas];
              }
            }
          };
          this.state.cancionesquery = this.state.canciones;
          console.log("canciones query: ", this.state.cancionesquery);
          console.log("canciones query length: ", this.state.cancionesquery.length);
          this.setState({
            loading: false
          })
        });
    
        
      };
    
      
    
      searchSong = (text) => {
        const updatedData = this.state.canciones.filter((item) => {
          const item_data = `${item.nombre.toUpperCase()})`;
          const text_data = text.toUpperCase();
          const item_data2 = `${item.artista.toUpperCase()})`;
          return item_data.indexOf(text_data) > -1 || item_data2.indexOf(text_data) > -1;
        });
        this.setState({ cancionesquery: updatedData, searchValue: text });
      };
      

    render() {
    
        if(this.state.loading){
          return (
            <View style={styles.container}>
              <Text style= {{textAlign : "center", fontSize:15}}>Cargando Lista...</Text>
            </View>
          );
        }
    
        return (
            <View style={{flex:1}}>
               <View>
               <View style>
               <Text style= {{textAlign : "center", fontSize:20, fontWeight:"bold", marginTop: 30}}>Lista: {this.state.nombreLista}</Text>
               <View style={styles.inputView}>
               <TextInput  
            style={styles.inputText}
            placeholder="Cambiar nombre de la lista..."
            onChangeText={text => this.state.nuevoNombre= text}/>
            </View>
                </View>
                {this.state.imagenMarcadas == "" && this.state.cover == ""? 
                <Text style= {{textAlign : "center", fontSize:15}}>Seleccione la imagen de una cancion para volverla el cover de la lista</Text>
                :
                <Image source={this.state.imagenMarcadas == "" ? {uri: 'https://img.youtube.com/vi/'+this.state.cover+'/hqdefault.jpg'} : {uri: 'https://img.youtube.com/vi/'+this.state.imagenMarcadas+'/hqdefault.jpg'}} style={{width:120, height:120, alignSelf:"center", marginBottom:10}}  />
                }
                
                 <SearchBar
                placeholder="Buscar en las Canciones..."
                lightTheme
                round
                value={this.state.searchValue}
                onChangeText={(text) => this.searchSong(text)}
                autoCorrect={false}
                />
                
               </View>
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} nestedScrollEnabled>
                

               
                <FlatList
                  scrollEnabled={false}
                  style={{flex: 0 }} 
                  data={this.state.cancionesquery}
                  renderItem={
                    ({item}) => 
                    <View style={styles.checkboxContainer}>
                      
                    
    
                    
                    <Card style={{ marginBottom:15, width: windowWidth*0.95, marginRight:5, marginLeft:5}}>
                    <Card.Title title={item.nombre} subtitle={item.artista} left={(props) => <TouchableOpacity onPress = {() => {this.state.imagenMarcadas = item.fuente; this.forceUpdate();}}><Image source={{uri: 'https://img.youtube.com/vi/'+item.fuente+'/hqdefault.jpg'}} style={[{width:50, height:50}, this.state.imagenMarcadas == item.fuente ? {opacity:0.5} : {opacity:1}]} /></TouchableOpacity>} right={(props) => <TouchableOpacity
                        onPress={() => {this.state.cancionesMarcadas[this.state.canciones.indexOf(item)] = !this.state.cancionesMarcadas[this.state.canciones.indexOf(item)]; this.forceUpdate();console.log("canciones marcadas ",this.state.cancionesMarcadas);console.log("canciones query ",this.state.cancionesquery); console.log("canciones item ", this.state.canciones.indexOf(item))}}
                      >{this.state.cancionesMarcadas[this.state.canciones.indexOf(item)] == true? 
                      <Icon
                        style={{marginRight:10}}
                        name='check'
                        type='Entypo'
                        /> 
                        :
                      <Icon
                        style={{marginRight:10}}
                        name='add'
                        type='Ionicons'
                    />}
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
                
                
              </ScrollView>
              <View>
              <TouchableOpacity style={styles.loginBtn} onPress={() => {
              var petition = '{"canciones":[';
                  for(let i = 0; i < this.state.canciones.length; i++){
                    if(this.state.cancionesMarcadas[i]){
                      var number = this.state.canciones[i].idCancion;
                      var bar = ''+number;
                      if(this.state.count == 0){
                        petition = petition+bar;
                        console.log("petition",petition);
                      }
                      else{
                        petition = petition+', '+bar;
                        console.log("petition with coma ",petition);
                      }
                      this.state.count = this.state.count + 1;
                      this.state.cancionesMarcadas[i] = !this.state.cancionesMarcadas[i];
                      console.log("count ", this.state.count);
                    }
                  };
                  this.setState({count: 0})
                  petition.slice(0,-2)
                  if(this.state.imagenMarcadas == "")
                    petition = petition + ']';
                  else{
                    petition = petition + '], "cover":"'+this.state.imagenMarcadas+'"';
                  }
                  if(this.state.nuevoNombre == ""){
                    petition = petition + '}'
                  }  
                  else{
                    petition = petition + ', "nombre":"'+this.state.nuevoNombre+'"}'
                  }  
                  console.log("petition ",petition);
                  fetch('https://musicboss-app.herokuapp.com/api/listas/'+this.state.listaId+'/', 
                  {
                    method: 'PATCH',
                    headers: {
                      'Content-Type':'application/json',  
                      'Authorization':'Token '+this.state.token
                    },
                    body: petition
                  })
                  .then(response => {
                    if (response.ok) {
                      Alert.alert("Lista Editada");
                      return response;
                    }
                    else {
                      var error = new Error('Error ' + response.status + ': ' + response.statusText);
                      error.response = response;
                      Alert.alert("Lista No Pudo Ser Editada");
                      throw error;
                      }
                  },
                  error => {
                          throw error;
                  })
                  .then(response => response.json() )
                  .then(response => {
                    console.log("response ",response);
                    this.props.navigation.navigate('MyLists');
                  }
                  ).catch(error => console.log("Error", error));
              
              console.log(this.state.uid);
              this.state.searchValue = "";
              
            }}>
                
                <Text style={styles.loginText}>Editar Lista</Text>
                </TouchableOpacity>
              </View>

              <View>
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
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/arms-up.png",
              screen: "User", // Change in future....
            },
             ]}/>
              </View>

              
                 
              </View>
           
        );
      
    }

}

const mapDispatchToProps = (dispatch) => {
  return {
      setUserid: (id) => dispatch(setUserId(id)),
      allLists: (lists) => dispatch(setAllLists(lists))
  }
};

const mapStateToProps = state => {
  return {
      token: state.nav.token,
      currUsername: state.nav.username,
      uid: state.nav.userid,
      lists: state.nav.allLists,
      editList: state.nav.editList,
      songsList: state.nav.songsList
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(EditList);
  
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 2,
  },
  item: {
    backgroundColor: "#585f71",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#912427",
    borderRadius:10,
    height:25,
    alignItems:"center",
    justifyContent:"center",
    marginTop:5,
    marginBottom:10,
    marginLeft:45
  },
  loginText:{
    color:"white"
  },
  inputText:{
    height:50,
    color:"white"
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  
  inputView:{
    width:"80%",
    backgroundColor:"#bfceff",
    borderRadius:25,
    height:30,
    marginBottom:10,
    justifyContent:"center",
    padding:20,
    alignSelf:"center"
  },
  inputText:{
    height:30,
    fontSize:17,
    color:"black",
    //fontWeight:"bold"
  }
});