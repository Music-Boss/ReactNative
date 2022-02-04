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

const getProfilePic = id => {
  console.log("Candidatos id: ",id);
  var uri = "https://randomuser.me/api/portraits/";
  uri += id%2 == 0 ? "women/": "men/";
  uri += id%100 +".jpg";
  return uri;
}

class AddFriends extends Component {
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
          amigos: [],
          amigosquery:[],
          urlAmigos: "https://musicboss-app.herokuapp.com/api/usuarios/",
          count: 0,
          currUsername: this.props.currUsername,
          userId: null,
          uid: this.props.uid,
          urlSolicitudes: "https://musicboss-app.herokuapp.com/api/solicitudes/",
          solicitudes: [],
          usertoadd: null
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
        console.log("token ", this.state.token);
        
        fetch(this.state.urlSolicitudes)
        .then(res => {return res.json()})
        .then(res =>{
            this.setState({
                solicitudes: res
            });

            }
        )
        .then(_ => {
            fetch(this.state.urlAmigos)
            .then(res => {
            console.log("res raws amigos: "+res);
            return res.json()})
            .then(res => {
            this.setState({
                amigos: res,
                amigosquery:res
            })
            console.log("res json amigos: " +res);
            })
            .then(_ => {
            console.log("length: ", this.state.amigos.length);
            for(let i = 0; i < this.state.amigos.length; i++){
                if(this.state.amigos[i].id == this.state.uid){
                    this.state.amigos.splice(i,1);
                }
                
            }
            for(let j = 0; j < this.state.solicitudes.length; j++){
                if(this.state.solicitudes[j].remitente.id == this.state.uid){
                    for(let k = 0; k < this.state.amigos.length; k++){
                        if(this.state.amigos[k].id == this.state.solicitudes[j].destinatario.id){
                            this.state.amigos.splice(k,1);
                        }
                    }
                }
                else if(this.state.solicitudes[j].destinatario.id == this.state.uid){
                    for(let k = 0; k < this.state.amigos.length; k++){
                        if(this.state.amigos[k].id == this.state.solicitudes[j].remitente.id){
                            this.state.amigos.splice(k,1);
                        }
                    }
                }
            }

            
            
            fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+this.state.uid+'/')
            .then(res => {return res.json()})
            .then(res => {
                for(let u = 0; u < res.amigos.length; u++){
                    for(let v = 0; v < this.state.amigos.length; v++){
                        if(res.amigos[u].id == this.state.amigos[v].id){
                            this.state.amigos.splice(v,1);
                        }
                    }
                };
                this.setState({
                    loading: false
                })
            })
            })
        }
        )
        
    
        
      };
    
      
    
      searchFriends = (text) => {
        const updatedData = this.state.amigos.filter((item) => {
          const item_data = `${item.username.toUpperCase()})`;
          const text_data = text.toUpperCase();;
          return item_data.indexOf(text_data) > -1;
        });
        this.setState({ amigosquery: updatedData, searchValue: text });
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
               <Text style= {{textAlign : "center", fontSize:20, marginTop: 30}}>Personas que se puede agregar</Text>
                </View>
                
                
                 <SearchBar
                placeholder="Buscar amigos..."
                lightTheme
                round
                value={this.state.searchValue}
                onChangeText={(text) => this.searchFriends(text)}
                autoCorrect={false}
                />
                
               </View>
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} nestedScrollEnabled>
                

               
                <FlatList
                  scrollEnabled={false}
                  style={{flex: 0 }} 
                  data={this.state.amigosquery}
                  renderItem={
                    ({item}) => 
                    <View style={styles.checkboxContainer}>
                      
                    
    
                    
                    <Card style={{ marginBottom:15, width: windowWidth*0.95, marginRight:5, marginLeft:5}}>
                    <Card.Title title={item.username} left={(props) =><Image source={{uri: getProfilePic(item.id)}} style={{width:50, height:50}} />} right={(props) => <TouchableOpacity
                        onPress={() => {
                            fetch('https://musicboss-app.herokuapp.com/api/usuario/'+this.state.uid+'/solicitud/'+item.id+'/', {
                                method: 'POST',
                                headers: {
                                'Content-Type':'application/json',  
                                'Authorization':'Token '+this.state.token
                                }
                            })
                            .then(res => {
                                console.log("respuesta de solicitud: "+res);
                                for(let i = 0; i < this.state.amigos.length; i++){
                                    if(this.state.amigos[i].id == item.id){
                                        this.state.usertoadd = this.state.amigos[i];
                                        console.log("user to add: ", this.state.usertoadd)
                                        this.state.amigos.splice(i,1);
                                        Alert.alert("Solicitud enviada.")
                                        this.forceUpdate();
                                        this.props.navigation.navigate('User')
                                    }
                                }
                            })
                        }}
                      ><Icon
                    name='add'
                    type='Ionicons'
                    />
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
                  keyExtractor={(item) => item.id}
                />
                
                
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
              disabled: "true",
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
      currUsername: state.nav.username,
      uid: state.nav.userid
  }
}
  
export default connect(mapStateToProps)(AddFriends);
  
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
    width:"50%",
    backgroundColor:"#912427",
    borderRadius:10,
    height:25,
    alignItems:"center",
    justifyContent:"center",
    marginTop:5,
    marginBottom:10,
    marginLeft:45,
    marginRight: 10
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