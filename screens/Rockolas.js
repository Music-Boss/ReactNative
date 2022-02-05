import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";
import axios from 'axios' 
import { Card } from "react-native-elements/dist/card/Card";
import { ScrollView } from "react-native-gesture-handler";
import ListCard from "./ListCard";
import Tabs from "../tabs/Tabs" 
import {connect} from 'react-redux'
import Bottom from "../tabs/Bottom"
 
const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};
  
const renderItem = ({ item }) => <Item title={item.title} />;
class Rockolas extends Component {
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
      uid: this.props.uid,
      fav_rockolas: [],
      noUser: this.props.noUser
    };
    //this.arrayholder = DATA;
  }
  
  componentDidMount(){
    this.getListas();
  }  

  getListas = () => {
    this.setState({ loading:true} );
    
    if(this.state.noUser == false)
    {
    this.state.token = this.props.token

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
      fetch("https://musicboss-app.herokuapp.com/api/usuario/info/"+this.state.uid+"/")
      .then(res => {
        console.log("res raws: "+res);
        return res.json()})
      .then(res => {
        for(let i = 0; i < res.fav_rockolas.length; i++){
          this.state.fav_rockolas = [...this.state.fav_rockolas, res.fav_rockolas[i].idRockola]
        }
        console.log("Fav_Rockolas:", this.state.fav_rockolas)
      
        console.log("res json: " +res);
      })
      .then(_ => {
        console.log("Pantalla cargada")
        this.setState({
          loading: false
        })
      });
    });
  }
  else{
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
      this.setState({
        loading: false
      })
      
    });

  }


    
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
              title: "Listas",
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/musical-notes.png",
              screen: "Lobby"
          },
          {
              id:"1",
              title:"Rockolas",
              image: "https://img.icons8.com/ios-glyphs/60/ffffff/jukebox.png",
              screen: "Rockolas", // Change in future....,
              disabled: "true"
          }
      ]}/>
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
            view="Rockola"
            favorito={true}
            esFavorito = {this.state.fav_rockolas.indexOf(item.idRockola) > -1 ? true : false}
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

const mapStateToProps = state => {
  return {
      token: state.nav.token,
      uid: state.nav.userid,
      noUser: state.nav.noUser
  }
}
  
export default connect(mapStateToProps)(Rockolas);
  
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
});