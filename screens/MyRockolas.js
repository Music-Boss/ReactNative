import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal, TextInput, TouchableOpacity, Image, Alert} from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";
import axios from 'axios' 
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { ScrollView } from "react-native-gesture-handler";
import ListCard from "./ListCard";
import Tabs from "../tabs/Tabs" 
import {connect} from 'react-redux'
import Bottom from "../tabs/Bottom"
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements'

const windowWidth = Dimensions.get('window').width;
 
const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};
  
class MyRockolas extends Component {
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
      data: [],
      query: [],
      error: null,
      url: "https://musicboss-app.herokuapp.com/api/rockolas/",
      searchValue: "",
      token: "",
      urlListas: "https://musicboss-app.herokuapp.com/api/listas/",
      listas: [],
      listasquery: [],
      listasMarcadas: [],
      idListas: [],
      nombreNuevaRockola: "",
      userId: null,
      modalShown: false,
      count: 0,
      imagenMarcada: ""
    };
    //this.arrayholder = DATA;
  }
  
  componentDidMount(){
    this.getListas();
  }  

  getListas = () => {
    this.setState({ loading:true} );

    fetch(this.state.url)
    .then(res => {
      console.log("res raws: "+res);
      return res.json()})
    .then(res => {
      this.setState({
        data: res.filter((item) => {
            if(item.usuario != null)
                return item.usuario.id == this.props.uid;
          }),
        query: res.filter((item) => {
            if(item.usuario != null)
                return item.usuario.id == this.props.uid;
          }),
        loading: false
      });
      console.log("res json: " +res);
    });

    this.state.token = this.props.token;
    this.state.imagenMarcada = "";

    fetch(this.state.urlListas)
    .then(res => {
      console.log("res raws: "+res);
      return res.json()})
    .then(res => {
      this.setState({
        listas: res,
        listasquery: res,
        loading: false
      });
      for(let i = 0; i < this.state.listas.length; i++){
          this.state.listasMarcadas[i] = false;
          this.state.idListas[i] = this.state.listas[i].idLista
      }
      console.log("res json: " +res);
      console.log("Listas Marcadas:", this.state.listasMarcadas)
      console.log("res json: " +res);
      console.log("Listas IDS:", this.state.idListas)
    });

    this.state.userId = this.props.uid;
  };

  searchFunction = (text) => {
    const updatedData = this.state.data.filter((item) => {
      const item_data = `${item.nombre.toUpperCase()})`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    this.setState({ query: updatedData, searchValue: text });
  };

  searchList = (text) => {
    const updatedData = this.state.listas.filter((item) => {
      const item_data = `${item.nombre.toUpperCase()})`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    this.setState({ listasquery: updatedData, searchValue: text });
  };

  toggleModal() {
    this.setState({
      modalShown: !this.state.modalShown
    });
    }

    onCloseModal = ()=>{
        this.setState({openModal : false})
      }
  
  render() {
    
    if(this.state.loading){
      return (
        <View style={styles.container}>
          <SearchBar
          placeholder="Cargando rockolas..."
          lightTheme
          round
          value={this.state.searchValue}
          />
        </View>
      );
    }

    return (
      <View style={{flex:1}}>
      <View style={{marginTop:30}}>
      <Tabs data = {[
          {
              id: "0",
              title: "Mis Listas",
              image: "https://img.icons8.com/ios-glyphs/30/ffffff/musical-notes.png",
              screen: "MyLists"
          },
          {
              id:"1",
              title:"Mis Rockolas",
              image: "https://img.icons8.com/ios-glyphs/30/ffffff/jukebox.png",
              screen: "MyRockolas", // Change in future....,
              disabled: "true"
          }
      ]}/>
      <Modal 
        animationType="slide"
        transparent= {false}
        visible={this.state.modalShown}
        toggle={this.toggleModal}
        onRequestClose={() => {console.log("Closing Modal..."); Alert.alert("Modal Closed."); this.getListas();
          
        this.toggleModal();}} 
       >
         <View style={{flex:1}}>
           <View>
           <View style={styles.inputView}>
            <TextInput  
            style={styles.inputText}
            placeholder="Nombre de La Nueva Rockola..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => this.state.nombreNuevaRockola= text}/>
            </View>
            {this.state.imagenMarcada == ""? 
            <Text style= {{textAlign : "center", fontSize:15}}>Seleccione la imagen de una cancion para volverla el cover de la Rockola.</Text>
            :
            <Image source={{uri: 'https://img.youtube.com/vi/'+this.state.imagenMarcada+'/hqdefault.jpg'}} style={{width:120, height:120, marginLeft:130}} />
            }            
            <SearchBar
          placeholder="Buscar en las Listas..."
          lightTheme
          round
          value={this.state.searchValue}
          onChangeText={(text) => this.searchList(text)}
          autoCorrect={false}
        />
           </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} nestedScrollEnabled>
            
            <FlatList
              scrollEnabled={false}
              style={{flex: 0}} 
              data={this.state.listasquery}
              initialNumToRender={this.state.listasquery.length + 1}
              renderItem={
                ({item}) => 
                <View style={styles.checkboxContainer}>
                  
                

                
                <Card style={{ marginBottom:15, width: windowWidth*0.95, marginRight:5, marginLeft:5}}>
                <Card.Title title={item.nombre}  left={(props) => <TouchableOpacity onPress = {() => {
                  if(item.cover != ""){
                    this.state.imagenMarcada = item.cover
                  }; this.forceUpdate();}}><Image source={item.cover == "" ? { uri: 'https://picsum.photos/id/145/500' } : {uri: 'https://img.youtube.com/vi/'+item.cover+'/hqdefault.jpg'}} style={[{width:50, height:50}, this.state.imagenMarcada == item.cover ? {opacity:0.5} : {opacity:1}]} /></TouchableOpacity>} right={(props) => <TouchableOpacity
                    onPress={() => {this.state.listasMarcadas[this.state.idListas.indexOf(item.idLista)] = !this.state.listasMarcadas[this.state.idListas.indexOf(item.idLista)]; this.forceUpdate();}}
                  >{this.state.listasMarcadas[this.state.idListas.indexOf(item.idLista)] == true? <Icon
                    name='check'
                    type='Entypo'
                    /> :<Icon
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
              keyExtractor={(item) => item.idLista}
            />
            
            
          </ScrollView>
          <View>
          <TouchableOpacity style={styles.loginBtn} onPress={() => {
          var petition = '{"nombre":"'+this.state.nombreNuevaRockola+'", "usuario":'+this.state.userId +', "listas":[';
              for(let i = 0; i < this.state.listas.length; i++){
                if(this.state.listasMarcadas[i]){
                  var number = this.state.idListas[i];
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
                  this.state.listasMarcadas[i] = !this.state.listasMarcadas[i];
                  console.log("count ", this.state.count);
                }
              };
              this.setState({count: 0})
              petition.slice(0,-2)
              if(this.state.imagenMarcada == "")
                petition = petition + ']}';
              else{
                for(let i = 0; i < this.state.listas.length; i++){
                  if(this.state.imagenMarcada == this.state.listas[i].cover){
                    if(this.state.listas[i].cover != ""){
                      petition = petition + '], "cover":"'+this.state.listas[i].cover+'"}'
                    }
                    else{
                      petition = petition + ']}';
                    }
                  }
                }
              }
              console.log("petition QUE SE ENVIA ",petition);
              fetch('https://musicboss-app.herokuapp.com/api/rockolas/', 
              {
                method: 'POST',
                headers: {
                  'Content-Type':'application/json',  
                  'Authorization':'Token '+this.state.token
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
                this.getListas();
              }
              ).catch(error => console.log("Error", error));
          Alert.alert("Rockola creada exitosamente!");
          console.log(this.state.uid);
          this.state.searchValue = "";
          
          this.toggleModal();
        }}>
            
            <Text style={styles.loginText}>Crear Nueva Rockola</Text>
            </TouchableOpacity>
          </View>
             
          </View>
        </Modal>

        <TouchableOpacity style={styles.loginBtn} onPress={() => {this.toggleModal(); }}>
          <Text style={styles.loginText}>Anadir Nueva Rockola (+)</Text>
        </TouchableOpacity>
        <SearchBar
          placeholder="Buscar en Rockolas..."
          lightTheme
          round
          value={this.state.searchValue}
          onChangeText={(text) => this.searchFunction(text)}
          autoCorrect={false}
        />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} nestedScrollEnabled>
        <View style={styles.container}>
        
        <FlatList
          style={{flex:0}} 
          data={this.state.query}
          renderItem={
            ({item}) => <ListCard 
            lista= {item}
            view="MyRockola"
            favortito={false}
            />
          }     
          keyExtractor={(item) => item.idRockola}
        />
        </View>
        </ScrollView>
        <View>
        <Bottom data = {[
            {
                id: "0",
                title: "Explorar",
                image: "https://img.icons8.com/ios-glyphs/60/ffffff/news.png",
                screen: "Lobby",
                
            },
            {
                id:"1",
                title:"Mis Listas",
                image: "https://img.icons8.com/ios-glyphs/60/ffffff/playlist--v1.png",
                screen: "MyLists", // Change in future....
                disabled: "true"
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

const mapStateToProps = state => {
  return {
      token: state.nav.token,
      uid: state.nav.userid
  }
}
  
export default connect(mapStateToProps)(MyRockolas);
  
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
      backgroundColor:"#1a2e6e",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
  });