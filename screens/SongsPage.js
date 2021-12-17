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
      data: [],
      query: [],
      error: null,
      url: 'https://musicboss-app.herokuapp.com/api/canciones/',
      searchValue: "",
    };
    //this.arrayholder = DATA;
  }
  
  componentDidMount(){
    this.getListas();
  }  

  getListas = () => {
    this.setState({ loading:true} );

    const songs = this.props.canciones;

    console.log("songs ", songs.songs);

    songs.songs.map((item) => {
        console.log(item);
        var s = ""+item;
        fetch(this.state.url+s)
        .then(res => {
          console.log("res raws: "+res);
          return res.json()})
        .then(res => {
          this.setState({
            data: [...this.state.data,res],
            query: [...this.state.query,res],
            loading: false
          })
          console.log("res json: " +res);
        });})
    
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
          placeholder="Loading listas..."
          lightTheme
          round
          value={this.state.searchValue}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search Here..."
          lightTheme
          round
          value={this.state.searchValue}
          onChangeText={(text) => this.searchFunction(text)}
          autoCorrect={false}
        />
        <FlatList 
          data={this.state.query}
          renderItem={
            ({item}) => <ListCardSong 
            lista= {item}
            />
          }     
          keyExtractor={(item) => item.idCancion}
        />

        
      </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        canciones: state.nav.songs
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