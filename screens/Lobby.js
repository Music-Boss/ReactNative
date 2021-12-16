import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";
import axios from 'axios' 
import { Card } from "react-native-elements/dist/card/Card";
import { ScrollView } from "react-native-gesture-handler";
import ListCard from "./ListCard";
 
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
        data: res,
        query: res,
        loading: false
      })
      console.log("res json: " +res);
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
            ({item}) => <ListCard 
            lista= {item}
            />
          }     
          keyExtractor={(item) => item.idLista}
        />
      </View>
    );
  }
}
  
export default Lobby;
  
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