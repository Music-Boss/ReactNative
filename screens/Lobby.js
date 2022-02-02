import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, FlatList, SafeAreaView, TextInput, TouchableOpacity, Modal } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";
import axios from 'axios' 
import { Card } from "react-native-elements/dist/card/Card";
import { ScrollView } from "react-native-gesture-handler";
import ListCard from "./ListCard";
import Tabs from "../tabs/Tabs" 
import Bottom from "../tabs/Bottom" 
import {connect} from 'react-redux'
import CheckBox from 'react-native-check-box'
import {setUserId, setAllLists} from '../slices/navSlice'
import {NavigationEvents} from 'react-navigation';

const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};
  
const renderItem = ({ item }) => <Item title={item.title} />;
class Lobby extends Component {
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
      url: "https://musicboss-app.herokuapp.com/api/listas/",
      searchValue: "",
      token: "",
      modalShown: false,
      canciones: [],
      cancionesquery:[],
      urlCanciones: "https://musicboss-app.herokuapp.com/api/canciones/",
      nombreNuevaLista: "",
      cancionesMarcadas: [],
      count: 0,
      urlUsuarios: "https://musicboss-app.herokuapp.com/api/usuarios/",
      usuarios: [],
      currUsername: this.props.currUsername,
      userId: null,
      fav_listas:[]
    };
    //this.arrayholder = DATA;
  }
  
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getListas();
    });
}

componentWillUnmount(){
  ;
} 



  
  getListas = () => {
    this.setState({ loading:true} );

    this.state.fav_listas = [];

    fetch(this.state.url)
    .then(res => {
      console.log("res raws: "+res);
      return res.json()})
    .then(res => {
      this.setState({
        data: res,
        query: res
      })
      console.log("res json: " +res);
      console.log("uid:", this.state.uid)
    })
    .then(_ => {
      for(let i = 0; i < this.state.data.length; i++){
        this.state.listaids = [this.state.data[i].idLista, ...this.state.listaids]
      }
    });

    this.state.token = this.props.token;
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
      console.log("length: ", this.state.canciones.length)
      for(let i = 0; i < this.state.canciones.length; i++){
        this.state.cancionesMarcadas = [...this.state.cancionesMarcadas, false]
      };
      console.log("length: ", this.state.cancionesMarcadas)
    });

    fetch(this.state.urlUsuarios)
    .then(res => {
      console.log("res raws usuarios: "+res);
      return res.json()})
    .then(res => {
      this.setState({
        usuarios: res
      })
      console.log("res json usuarios: " +res);
    })
    .then(_ => {
      console.log("length: ", this.state.usuarios.length);
      console.log("users: ", this.state.usuarios);
      console.log("curruser: ", this.state.currUsername.text);
      
      for(let i = 0; i < this.state.usuarios.length; i++){
        if(this.state.usuarios[i].username == this.state.currUsername.text){
          this.props.setUserid(this.state.usuarios[i].id);
          this.state.userId = this.state.usuarios[i].id;
        }
      };
      console.log("Usuario guardado en estado! ", this.state.userId)
    })
    .then(_ => {
      fetch("https://musicboss-app.herokuapp.com/api/usuario/info/"+this.state.userId+"/")
      .then(res => {
        console.log("res raws: "+res);
        return res.json()})
      .then(res => {
        console.log("LONGITUD DE FAV_LISTAS:",res.fav_listas.length)
        for(let i = 0; i < res.fav_listas.length; i++){
          this.state.fav_listas = [...this.state.fav_listas, res.fav_listas[i].idLista]
        }
        console.log("Fav_Listas:", this.state.fav_listas)
      
        console.log("res json: " +res);
      })
      .then(_ => {
        console.log("Pantalla cargada")
        this.setState({
          loading: false
        })
      });

    });

    

    
  };

  searchFunction = (text) => {
    const updatedData = this.state.data.filter((item) => {
      const item_data = `${item.nombre.toUpperCase()})`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    this.setState({ query: updatedData, searchValue: text });
  };


  render() {
    
    if(this.state.loading){
      return (
        <View style={styles.container}>
          <SearchBar
          placeholder="Cargando listas..."
          lightTheme
          round
          value={this.state.searchValue}
          />
        </View>
      );
    }

    return (
      <View style={{flex:1}}>
        <View style={{marginTop: 30}}>
        <Tabs data = {[
        {
            id: "0",
            title: "Listas",
            image: "https://img.icons8.com/ios-glyphs/30/ffffff/musical-notes.png",
            screen: "Lobby",
            disabled: "true"
        },
        {
            id:"1",
            title:"Rockolas",
            image: "https://img.icons8.com/ios-glyphs/30/ffffff/jukebox.png",
            screen: "Rockolas", // Change in future....
        }
    ]}/> 
        
        <SearchBar
          placeholder="Buscar en las Listas..."
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
            view="Lobby"
            favorito={true}
            esFavorito={this.state.fav_listas.indexOf(item.idLista) > -1 ? true : false}
            />
          }     
          keyExtractor={(item) => item.idLista}
          
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
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setUserid: (id) => dispatch(setUserId(id))
  }
};

const mapStateToProps = state => {
  return {
      token: state.nav.token,
      currUsername: state.nav.username,
      uid: state.nav.userid
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
  
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