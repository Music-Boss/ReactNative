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

const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};
  
const renderItem = ({ item }) => <Item title={item.title} />;
class MyLists extends Component {
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
      uid: this.props.uid,
      imagenMarcadas: -1
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
      })});
      this.state.loading= false;
      console.log("res json: " +res);
    });

    console.log("prop data: ", this.state.data)

    
    

    this.state.token = this.props.token;
    this.state.imagenMarcadas = -1;
    console.log("token ", this.state.token);

    fetch(this.state.urlCanciones)
    .then(res => {
      console.log("res raws canciones: "+res);
      return res.json()})
    .then(res => {
      this.setState({
        canciones: res,
        cancionesquery:res,
        loading: false
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
        usuarios: res,
        loading: false
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

  searchSong = (text) => {
    const updatedData = this.state.canciones.filter((item) => {
      const item_data = `${item.nombre.toUpperCase()})`;
      const text_data = text.toUpperCase();
      const item_data2 = `${item.artista.toUpperCase()})`;
      return item_data.indexOf(text_data) > -1 || item_data2.indexOf(text_data) > -1;
    });
    this.setState({ cancionesquery: updatedData, searchValue: text });
  };
  
  onCloseModal = ()=>{
    this.setState({openModal : false})
  }

  toggleModal() {
    this.setState({
      modalShown: !this.state.modalShown
    });
}


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
       <View style={{marginTop:30}}>
       <Tabs data = {[
        {
            id: "0",
            title: "Mis Listas",
            image: "https://img.icons8.com/ios-glyphs/30/000000/musical-notes.png",
            screen: "MyLists",
            disabled: "true"
        },
        {
            id:"1",
            title:"Mis Rockolas",
            image: "https://img.icons8.com/ios-glyphs/30/000000/jukebox.png",
            screen: "MyRockolas", // Change in future....
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
            placeholder="Nombre de La Nueva Lista..." 
            placeholderTextColor="#ffffff"
            onChangeText={text => this.state.nombreNuevaLista= text}/>
            </View>
            {this.state.imagenMarcadas == -1? 
            <Text style= {{textAlign : "center", fontSize:15}}>Seleccione la imagen de una cancion para volverla el cover de la lista</Text>
            :
            <Image source={{uri: 'https://img.youtube.com/vi/'+this.state.canciones[this.state.imagenMarcadas-1].fuente+'/hqdefault.jpg'}} style={{width:120, height:120, marginLeft:130}} />
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
              style={{flex: 0}} 
              data={this.state.cancionesquery}
              initialNumToRender={this.state.cancionesquery.length + 1}
              renderItem={
                ({item}) => 
                <View style={styles.checkboxContainer}>
                  
                

                
                <Card style={{ marginBottom:15, width: windowWidth*0.95, marginRight:5, marginLeft:5}}>
                <Card.Title title={item.nombre} subtitle={item.artista} left={(props) => <TouchableOpacity onPress = {() => {this.state.imagenMarcadas = item.idCancion; this.forceUpdate();}}><Image source={{uri: 'https://img.youtube.com/vi/'+item.fuente+'/hqdefault.jpg'}} style={[{width:50, height:50}, this.state.imagenMarcadas == item.idCancion ? {opacity:0.5} : {opacity:1}]} /></TouchableOpacity>} right={(props) => <TouchableOpacity
                    onPress={() => {this.state.cancionesMarcadas[Number(item.idCancion)-1] = !this.state.cancionesMarcadas[Number(item.idCancion)-1]; this.forceUpdate();console.log("canciones marcadas ",this.state.cancionesMarcadas)}}
                  >{this.state.cancionesMarcadas[Number(item.idCancion)-1] == true? <Icon
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
              keyExtractor={(item) => item.idCancion}
            />
            
            
          </ScrollView>
          <View>
          <TouchableOpacity style={styles.loginBtn} onPress={() => {
          var petition = '{"nombre":"'+this.state.nombreNuevaLista+'", "usuario":'+this.state.userId +', "canciones":[';
              for(let i = 0; i < this.state.canciones.length; i++){
                if(this.state.cancionesMarcadas[i]){
                  var number = i+1;
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
              if(this.state.imagenMarcadas == -1)
                petition = petition + ']}';
              else{
                petition = petition + '], "cover":"'+this.state.canciones[this.state.imagenMarcadas-1].fuente+'"}';
              }
              console.log("petition ",petition);
              fetch('https://musicboss-app.herokuapp.com/api/listas/', 
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
                  Alert.alert("Lista Creada");
                  return response;
                }
                else {
                  var error = new Error('Error ' + response.status + ': ' + response.statusText);
                  error.response = response;
                  Alert.alert("Lista No Pudo Ser Creada");
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
          
          console.log(this.state.uid);
          this.state.searchValue = "";
          
          this.toggleModal();
        }}>
            
            <Text style={styles.loginText}>Crear Nueva Lista</Text>
            </TouchableOpacity>
          </View>
             
          </View>
        </Modal> 
        <TouchableOpacity style={styles.loginBtn} onPress={() => {console.log("canciones marcadas: ",this.state.cancionesMarcadas); this.toggleModal(); }}>
          <Text style={styles.loginText}>Anadir Nueva Lista (+)</Text>
        </TouchableOpacity>
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
            favorito={false}
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
                image: "https://img.icons8.com/ios-glyphs/30/000000/musical-notes.png",
                screen: "Lobby"
            },
            {
                id:"1",
                title:"Mis Listas",
                image: "https://img.icons8.com/ios-glyphs/30/000000/jukebox.png",
                screen: "MyLists", // Change in future....
                disabled: "true"
            },
            {
              id:"2",
              title:"Favoritos",
              image: "https://img.icons8.com/ios-glyphs/30/000000/jukebox.png",
              screen: "ListasFavoritos", // Change in future....
            },
            {
              id:"3",
              title:"Perfil",
              image: "https://img.icons8.com/ios-glyphs/30/000000/jukebox.png",
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
      lists: state.nav.allLists
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(MyLists);
  
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