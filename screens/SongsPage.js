import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";
import axios from 'axios' 
import { Card } from "react-native-elements/dist/card/Card";
import { ScrollView } from "react-native-gesture-handler";
import ListCardSong from "./ListCardSong";
import { useNavigation, useNavigationParam } from '@react-navigation/native';
import {connect} from 'react-redux'
import Bottom from '../tabs/Bottom'
 
const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};
  
const renderItem = ({ item }) => <Item title={item.title} />;
class SongsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: this.props.canciones,
      query: this.props.canciones,
      error: null,
      url: 'https://musicboss-app.herokuapp.com/api/canciones/',
      searchValue: "",
      title: this.props.nameL
    };
    //this.arrayholder = DATA;
  }
  
  componentDidMount(){
  }  

  
  render() {
    
    if(this.state.loading){
      return (
        <View style={styles.container}>
            <Text  style= {{textAlign : "center", fontSize:20}}>
             Cargando Lista de Canciones....
             </Text> 
        </View>
      );
    }

    return (
      <View style={{flex:1}}>
        <View style={{marginTop:30}}>
          <Text style= {{textAlign : "center", fontSize:20}}>Lista de Canciones {this.state.title}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} nestedScrollEnabled>
          <View style={styles.container}>
            <FlatList 
              data={this.state.query}
              style={{flex:0}}
              renderItem={
                ({item}) => <ListCardSong 
                lista= {item}
                />
              }
              horizontal = {false}    
              keyExtractor={(item) => item.idCancion}
              numColumns = {2}
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

const mapStateToProps = state => {
    return {
        canciones: state.nav.songs,
        nameL: state.nav.nList
    }
}
  
export default connect(mapStateToProps)(SongsPage);
  
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