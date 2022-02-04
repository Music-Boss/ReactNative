import React, { Component } from 'react'
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity, 
  FlatList,
  TextInput, Alert,
  Modal
} from 'react-native'
import { Dimensions } from 'react-native';
import {connect} from 'react-redux'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Bottom from "../tabs/Bottom" 
import { Icon } from 'react-native-elements'
import OptionsMenu from "react-native-option-menu";

const windowWidth = Dimensions.get('window').width;

const Bold = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};

const myIcon = (<Icon
  name='menu'
  type='Feather'
  color='#000000'
/>)

const getProfilePic = id => {
  console.log("id: ",id);
  var uri = "https://randomuser.me/api/portraits/";
  uri += id%2 == 0 ? "women/": "men/";
  uri += id%100 +".jpg";
  return uri;
}

const getBackgroundPic = id => {
  console.log("bg pic id: ",id);
  var uri = "https://picsum.photos/id/"; //237/960/640
  uri += id%1000 + "/960/640";
  console.log("final bg uri: "+uri);
  return uri;
}

  
const renderItem = ({ item }) => <Item title={item.title} />;
class User extends Component {
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
          url: 'https://musicboss-app.herokuapp.com/api/usuarios/',
          users:[],
          mainuser: [],
          nombre: " Nombre",
          apellido: "Apellido",
          amigos: [],
          modalShown: false,
          modalShown2: false,
          nuevoNombre: "",
          nuevoApellido: "",
          nuevoCorreo: "",
          token: "",
          count: 0,
          bio: "",
          nuevoBio: "",
          pais:"",
          nuevoPais:"",
          solicitudes: [],
          usereliminated: null
        };
        //this.arrayholder = DATA;
    }

    componentDidMount() {
        this.getListas();
    }
    
      toggleModal() {
        this.setState({
          modalShown: !this.state.modalShown
        });
    }
    toggleModal2() {
      this.setState({
        modalShown2: !this.state.modalShown2
      });
  }

    getListas = () => {
        this.setState({ loading:true} );

        this.state.count = 0;

        this.state.nuevoNombre="";
        this.state.nuevoApellido="";
        this.state.nuevoCorreo="";
        this.state.nuevoBio="";
        this.state.nuevoPais="";

        this.state.token=this.props.token;
    
        

        fetch(this.state.url)
        .then(res => {
          console.log("res raws: "+res);
          return res.json()})
        .then(res => {
          this.setState({
            users: res,
          })
          console.log("res json: " +res);
        })
        .then(_ => {
            for(let i = 0; i < this.state.users.length; i++){
                if(this.state.users[i].username == this.props.currUsername.text){
                    this.state.mainuser = this.state.users[i]
                    break;
                }
            }
            console.log("Main User: ", this.state.mainuser.username);
            console.log("Main User id: ", this.state.mainuser.id);
            
            fetch('http://musicboss-app.herokuapp.com/api/usuario/info/'+this.props.uid+'/')
            .then(res => {
                console.log("res raws: "+res);
                return res.json()})
              .then(res => {
                this.setState({
                  amigos: res.amigos,
                  bio: res.bio,
                  pais: res.pais
                })
                console.log("amigos: " +res.amigos);
                fetch('https://musicboss-app.herokuapp.com/api/solicitudes/')
                .then(res => {return res.json()})
                .then(res => {
                  for(let i = 0; i < res.length; i++){
                    if(res[i].destinatario.id == this.props.uid){
                      this.state.solicitudes = [...this.state.solicitudes, res[i]];
                    }
                  }
                  this.setState({
                    loading: false
                  });
                })
              })
            
        });

        
    }

    render() {
        if(this.state.loading){
            return(
                <View>
                    <Text>Cargando...</Text>
                </View>
            )
        }

        return (
            <View style={{flex:1,  flexDirection: 'column'}}>
                <View style={{height:280}}>
                  <View style={{
                        marginBottom: 10,
                        position: 'relative',
                    }}>
                    <ImageBackground
                        source={{
                        uri: getBackgroundPic(this.state.mainuser.id),
                        }}
                        style={{
                            height: Dimensions.get('window').width * (3/8),
                            width: Dimensions.get('window').width,
                          }}
                    >
                        <View style={{
                            backgroundColor: 'transparent',
                            flex: 1,
                            justifyContent: 'space-between',
                            paddingTop: 45,
                        }}>
                        <Text style={{
                            color: '#FFF',
                            fontSize: 24,
                            fontWeight: 'bold'
                        }} />
                        </View>
                        <View style={{
                            backgroundColor: 'transparent',
                            paddingBottom: 10,
                            paddingLeft: 135,
                        }}>
                        <Text style={{
                            color: '#FFF',
                            fontSize: 28,
                            fontWeight: 'bold',
                            paddingBottom: 2,
                            marginLeft:-120
                        }}>{'@'+this.props.currUsername.text}</Text>
                        
                        </View>
                    </ImageBackground>
                  </View>
                    <View style={{
                        bottom: 0,
                        left: 10,
                        paddingBottom:0,
                        flexDirection: 'row'
                    }}>
                    <View>
                    <Text style={{
                            color: '#000',
                            fontSize: 28,
                            fontWeight: 'bold',
                            paddingBottom: 2,
                        }}>{this.state.mainuser.first_name != "" ? this.state.mainuser.first_name : this.state.nombre}
                    </Text>

                    <Text style={{
                            color: '#000',
                            fontSize: 28,
                            fontWeight: 'bold',
                            paddingBottom: 2,
                        }}>{this.state.mainuser.last_name != "" ? this.state.mainuser.last_name : this.state.apellido}
                    </Text>
                    <Text style={{
                            color: '#000',
                            fontSize: 12,
                            fontWeight: '1000',
                    }}>{this.state.bio == "" ? " Bio": this.state.bio}</Text>
                    </View>
                    <Image
                        source={{
                        uri: getProfilePic(this.state.mainuser.id),//'https://i.imgur.com/3oyxBVT.jpg',
                        }}
                        style={{borderColor: '#FFF',
                        borderRadius: 55,
                        borderWidth: 3,
                        height: 110,
                        width: 110,
                        marginLeft:180
                       }}
                    />
                    </View>
                    <Modal
                    animationType="slide"
                    transparent= {true}
                    visible={this.state.modalShown}
                    toggle={this.toggleModal}
                    onRequestClose={() => {console.log("Modal Cerrado..."); 
                    
                    this.toggleModal();}}>
                      
                    <View style={{flex:1, backgroundColor:"#000000aa"}}>      
                      <View style={{backgroundColor:"#ffffff", margin:25, paddingHorizontal:30, paddingVertical:10, borderRadius:25,}}>
                        <Text style={{fontSize:20, fontWeight:"bold", alignSelf:"center", marginBottom: 15}}>Editar Información Personal</Text>
                        <View style={styles.inputView}>
                          <TextInput style={styles.inputText}  
                          placeholder="Nombres..." 
                          //placeholderTextColor="#000"
                          onChangeText={text => this.state.nuevoNombre= text}/>    
                        </View>
                      
                        <View style={styles.inputView}>
                          <TextInput  
                          style={styles.inputText}
                          placeholder="Apellidos..." 
                          onChangeText={text => this.state.nuevoApellido= text}/>
                        </View>
          
                    <View style={{...styles.inputView,...{height: 120}}}>
                        <TextInput style={{...styles.inputText, ...{height: 100}}}
                        placeholder="Descripción"
                        onChangeText={text => this.state.nuevoBio = text}
                        multiline={true} />
                        
                    </View>
                    <View style={styles.inputView}>
                      <TextInput  
                      style={styles.inputText}
                      placeholder="Correo electrónico..." 
                      onChangeText={text => this.state.nuevoCorreo= text}/>
                    </View>
                    <View style={styles.inputView}>
                      <TextInput style={styles.inputText} 
                      placeholder="País..." 
                      onChangeText={text => this.state.nuevoPais= text}/>
                    </View>
                        
                    <TouchableOpacity style={styles.loginBtn2} onPress={() => {
                      var alert = "";
                      var petition = '{';
                      var p1 = false;
                      var p2 = false;
                        if(this.state.nuevoNombre != ""){
                          petition = petition + '"first_name":"'+this.state.nuevoNombre+'"';
                          p1=true;
                          this.state.count = this.state.count + 1;
                        }
                        if(this.state.nuevoApellido != ""){
                          if(this.state.count != 0){
                            petition = petition + ', ';
                          }
                          petition = petition+'"last_name":"'+this.state.nuevoApellido+'"';
                          p1=true;
                          this.state.count = this.state.count + 1;
                        }
                        if(this.state.nuevoCorreo != ""){
                          if(this.state.count != 0){
                            petition = petition + ', ';
                          }
                          petition = petition+'"email":"'+this.state.nuevoCorreo+'"';
                          p1=true;
                        }
                        petition = petition + '}'
                        console.log("petition ",petition);
                        console.log(this.props.uid)
                        

                        var petition2 = '{'

                        this.state.count = 0;

                        if (this.state.nuevoBio != ""){
                          petition2=petition2+'"bio":"'+this.state.nuevoBio+'"';
                          this.state.count = this.state.count + 1;
                          p2=true;                            
                        }

                        if(this.state.nuevoPais != ""){
                          if(this.state.count != 0){
                            petition2 = petition2+', '
                          }
                          petition2 = petition2+'"pais":"'+this.state.nuevoPais+'"';
                          p2=true;
                        }

                        petition2 = petition2 + '}';
                        console.log("petition2 ",petition2);
                        if(p1 == true && p2 == false){
                          console.log("ENTRÓ AL PRIMER IF")    
                        fetch('https://musicboss-app.herokuapp.com/api/usuarios/'+this.props.uid+'/', 
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
                            return response;
                            }
                            else {
                            var error = new Error('Error ' + response.status + ': ' + response.statusText);
                            error.response = response;
                            console.log("error in petition!")
                            Alert.alert("Error al actualizar su información. Verfique que todos los campos fueron llenados correctamente.");
                            this.getListas();
                            this.toggleModal();
                            throw error;
                            }
                        },
                        error => {
                                throw error;
                        })
                        .then(response => response.json() )
                        .then(response => {
                          
                            if(this.state.nuevoCorreo != ""){
                              if (response.email[0] == "Introduzca una dirección de correo electrónico válida."){
                                alert = alert + "Correo electrónico inválido"
                              }
                            }

                            console.log("response ",response);
                            if(alert != "")  
                              Alert.alert(alert);
                            else
                              Alert.alert("Usuario actualizado exitosamente!")                

                            this.getListas();

                            this.toggleModal();
                        }
                        ).catch(error => console.log("Error", error));}

                        else if(p2==true && p1 == false){
                        fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+this.props.uid+'/', 
                        {
                            method: 'PATCH',
                            headers: {
                            'Content-Type':'application/json',  
                            'Authorization':'Token '+this.state.token
                            },
                            body: petition2
                        })
                        .then(response => {
                            if (response.ok) {
                            return response;
                            }
                            else {
                            var error = new Error('Error ' + response.status + ': ' + response.statusText);
                            error.response = response;
                            Alert.alert("Error al actualizar su información. Verfique que todos los campos fueron llenados correctamente.");
                            this.getListas();
                            this.toggleModal();
                            throw error;
                            }
                        },
                        error => {
                                throw error;
                        })
                        .then(response => response.json() )
                        .then(response => {
                          
                            if(this.state.nuevoPais != ""){
                              if (response.pais[0].includes("no es una elección válida.")){
                                alert = alert + "Pais inválido"
                              }
                            }

                            console.log("response ",response);
                            if(alert != "")  
                              Alert.alert(alert);
                            else
                              Alert.alert("Usuario actualizado exitosamente!")

                            this.getListas();

                            this.toggleModal();
                        }
                        ).catch(error => console.log("Error", error));}

                        else if(p1 == true && p2 == true){
                          fetch('https://musicboss-app.herokuapp.com/api/usuarios/'+this.props.uid+'/', 
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
                              return response;
                              }
                              else {
                              var error = new Error('Error ' + response.status + ': ' + response.statusText);
                              error.response = response;
                              console.log("ERROR!")
                              Alert.alert("Error al actualizar su información. Verfique que todos los campos fueron llenados correctamente.");
                              this.getListas();
                              this.toggleModal();
                              throw error;
                              }
                          },
                          error => {
                                  throw error;
                          })
                          .then(response => response.json() )
                          .then(response => {
                            
                              if(this.state.nuevoCorreo != ""){
                                if (response.email[0] == "Introduzca una dirección de correo electrónico válida."){
                                  alert = alert + "Correo electrónico inválido"
                                }
                              }

                              fetch('https://musicboss-app.herokuapp.com/api/usuario/info/'+this.props.uid+'/', 
                              {
                                  method: 'PATCH',
                                  headers: {
                                  'Content-Type':'application/json',  
                                  'Authorization':'Token '+this.state.token
                                  },
                                  body: petition2
                              })
                              .then(response => {
                                  if (response.ok) {
                                  return response;
                                  }
                                  else {
                                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                                    error.response = response;
                                    console.log("ERROR!");
                                    console.log("ERROR!")
                                    Alert.alert("Error al actualizar su información.");
                                    Alert.alert("Verfique que todos los campos \n fueron llenados correctamente.");
                                    Alert.alert("Es posible que algunos datos si se hayan actualizado.")
                                    this.getListas();
                                    this.toggleModal();
                                    throw error;
                                  }
                                },
                                error => {
                                          throw error;
                              })
                              .then(response => response.json() )
                              .then(response => {
                                
                                  if(this.state.nuevoPais != ""){
                                    if (response.pais[0].includes("no es una elección válida.")){
                                      alert = alert + "Pais inválido"
                                    }
                                  }

                                  console.log("response ",response);
                                  if(alert != "")  
                                    Alert.alert(alert);
                                  else
                                    Alert.alert("Usuario actualizado exitosamente!")

                                  this.getListas();

                                  this.toggleModal();
                              }
                              ).catch(error => console.log("Error", error));

                                             

                              
                          }
                          ).catch(error => console.log("Error", error));
                        }

                        
                    
                    console.log(this.state.uid);
                    
                    
                    }}>
                        
                        <Text style={styles.loginText}>Editar Información</Text>
                        </TouchableOpacity>
                    </View>
                        
                    </View>
                    </Modal>

                    <Modal
                    animationType="slide"
                    transparent= {true}
                    visible={this.state.modalShown2}
                    toggle={this.toggleModal2}
                    onRequestClose={() => {console.log("Modal 2 Cerrado..."); 
                    
                    this.toggleModal2();}} 
                    >
                    <View style={{flex:1, backgroundColor:"#000000aa"}}>
                    <View style={{backgroundColor:"#ffffff", margin:30, padding:20, borderRadius:25}}>
                    <Image source={{uri: getProfilePic(this.state.usereliminated?.id)}} style={{width:100, height:100, borderRadius:50, alignSelf:"center"}} />
                    <Text style={{ fontSize:15, marginTop:20, marginBottom:10, alignSelf:"center"}}>
                      <Text>¿Seguro que quieres eliminar a</Text>
                      <Text style={{fontWeight:"bold"}}> @{this.state.usereliminated?.username}?</Text>
                    </Text>
                    
                    <View style={{flexDirection:'row', alignSelf:"center", marginTop:10}}>
                    <TouchableOpacity onPress = {() => { fetch('https://musicboss-app.herokuapp.com/api/usuario/'+this.props.uid+'/amigos/'+this.state.usereliminated.id+'/', {
                                      method: 'DELETE',
                                      headers: {
                                      'Content-Type':'application/json',  
                                      'Authorization':'Token '+this.state.token
                                      }
                                        })
                                        .then(res => {console.log(res); this.props.navigation.navigate('Lobby'); this.props.navigation.navigate('User'); this.toggleModal2();})}}>
                        <Icon
                            name='check'
                            type='Entypo'
                         />
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginLeft: 30}} onPress = {() => {this.toggleModal2();}}>
                        <Icon
                            name='close'
                            type='Evillcons'
                         />
                    </TouchableOpacity>

                    </View>

                    </View>
                    </View>
                  </Modal> 
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1}} nestedScrollEnabled>
                    <Card style={{marginTop:20}}>
                        <Card.Title title="Información Personal" 
                        right={(props) => 
                        <TouchableOpacity style={styles.loginBtn}>
                            <Text style={styles.loginText} onPress={()=>{ this.toggleModal();}}>
                                Editar
                            </Text>
                        </TouchableOpacity>}  />
                    
                        <Card.Content style = {{marginBottom: 20}}>
                            <View style={{flexDirection: 'row'}}>
                        
                                <Text style={{fontWeight: 'bold'}}>Correo Electrónico</Text>
                                <Text >{"   "+this.state.mainuser.email}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                        
                                <Text style={{fontWeight: 'bold'}}>Pais</Text>
                                <Text >{"   "+this.state.pais}</Text>
                            </View>
                        
                        
                        </Card.Content>
                        
                        {/*<Card.Actions>
                        <Button>Cancel</Button>
                        <Button>Ok</Button>
                        </Card.Actions>
                        */}
                    </Card>
                    <Text style={{fontWeight: 'bold', fontSize:15, marginLeft:10, marginTop:20, marginBottom:20}}>Solicitudes</Text>
                        {
                        this.state.solicitudes.length == 0 ? 
                        <Text style={{fontSize:15, marginLeft:10, marginVertical:10}}>No tienes solicitudes pendientes.</Text>
                        :
                        <FlatList
                        scrollEnabled={false}
                        style={{flex: 0 }} 
                        data={this.state.solicitudes}
                        renderItem={
                          ({item}) => 
                          <View style={styles.checkboxContainer}>
                            
                          
          
                          
                          <Card style={{ marginBottom:15, width: windowWidth*0.95, marginRight:5, marginLeft:5, borderRadius:10}}>
                          <Card.Title title={item.remitente.username} left={(props) =><Image source={{uri: getProfilePic(item.remitente.id) /* 'https://i.imgur.com/3oyxBVT.jpg'*/}} style={{width:50, height:50}} />} right={(props) => <View style={{flexDirection:'row'}}><TouchableOpacity
                              onPress={() => {
                                  fetch('https://musicboss-app.herokuapp.com/api/usuario/'+item.remitente.id+'/solicitud/'+item.destinatario.id+'/aceptar/', {
                                      method: 'PUT',
                                      headers: {
                                      'Content-Type':'application/json',  
                                      'Authorization':'Token '+this.state.token
                                      }
                                  })
                                  .then(res => {
                                      console.log("respuesta de solicitud: "+res);
                                      for(let i = 0; i < this.state.solicitudes.length; i++){
                                          if(this.state.solicitudes[i].idSolicitud == item.idSolicitud){
                                              this.state.solicitudes.splice(i,1);
                                              this.forceUpdate();
                                              this.props.navigation.navigate('Lobby');
                                              this.props.navigation.navigate('User');
                                          }
                                      }
                                  })
                              }}
                            >
                          
                          <Icon 
                            name='check'
                            type='Entypo'/>
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={() => {
                                  fetch('https://musicboss-app.herokuapp.com/api/usuario/'+item.remitente.id+'/solicitud/'+item.destinatario.id+'/', {
                                      method: 'DELETE',
                                      headers: {
                                      'Content-Type':'application/json',  
                                      'Authorization':'Token '+this.state.token
                                      }
                                  })
                                  .then(res => {
                                      console.log("respuesta de solicitud: "+res);
                                      for(let i = 0; i < this.state.solicitudes.length; i++){
                                          if(this.state.solicitudes[i].idSolicitud == item.idSolicitud){
                                              this.state.solicitudes.splice(i,1);
                                              this.forceUpdate();
                                          }
                                      }
                                  })
                              }}
                            ><Icon
                            name='close'
                            type='Evillcons'
                         />
                          </TouchableOpacity>
                          </View>
                          }/>
                          
                          
                          {/*<Card.Actions>
                          <Button>Cancel</Button>
                          <Button>Ok</Button>
                          </Card.Actions>
                          */}
                          </Card>
                          </View>
                        }     
                        keyExtractor={(item) => item.idSolicitud}
                      />
                  }
                    <View style={{flexDirection:'row'}}>
                      <Text style={{fontWeight: 'bold', fontSize:15, marginLeft:10, marginTop:20}}>Amigos</Text>
                      <TouchableOpacity style={styles.loginBtn3} onPress={() => this.props.navigation.navigate('AddFriends')}>
                        <Text style={styles.loginText}>Buscar amigos</Text>
                    </TouchableOpacity>

                    </View>
                    {this.state.amigos.length == 0 ? 
                    <Text style={{ fontSize:15, marginLeft:10, marginTop:20}}>Todavía no tienes amigos agregados.</Text>
                    :
                    <FlatList
                        style={{flex:0}} 
                        data={this.state.amigos}
                        renderItem={
                            ({item}) => 
                            <View style={styles.checkboxContainer}>
                  
                

                
                            <Card style={{ marginBottom:15, width: windowWidth*0.95, marginRight:5, marginLeft:5}} >
                            <Card.Title title={item.username} />
                            
                            
                            {/*<Card.Actions>
                            <Button>Cancel</Button>
                            <Button>Ok</Button>
                            </Card.Actions>
                            */}
                            <Card.Content>
                            <View style={{flexDirection: 'row'}}>
                        
                                <Image source={{uri: getProfilePic(item.id) /*'https://i.imgur.com/3oyxBVT.jpg'*/}} style={{width:100, height:100, borderRadius:50}} />
                                <View>
                                    <Text style={{fontWeight:'bold', marginLeft:10}}>Fecha que se unió</Text>
                                    <Text style={{marginLeft:10}}>{item.date_joined}</Text>
                                    <Text style={{fontWeight:'bold', marginLeft:10}}>Última conexión</Text>
                                    <Text style={{marginLeft:10}}>{item.last_login}</Text>
                                    <TouchableOpacity style={styles.loginBtn3} onPress={() => {this.state.usereliminated= item; this.toggleModal2();}}>
                                      <Text style={styles.loginText}>Eliminar</Text>

                                  </TouchableOpacity>

                                </View>
                            </View>
                           
                        
                        
                            </Card.Content>
                            </Card>
                            </View>
                        }     
                        keyExtractor={(item) => item.id}
                        
                        />
                      }
                        
                      
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
              disabled: "true"
            },
             ]}/>
                </View>
            </View>
        )
      }
}


const mapDispatchToProps = (dispatch) => {
    return {
        
    }
  };
  
const mapStateToProps = state => {
    return {
        token: state.nav.token,
        currUsername: state.nav.username,
        uid: state.nav.userid
    }
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#EABE3F",
      marginBottom:40,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -2, height: 2},
      textShadowRadius: 5},
      forgot:{
      color:"black",
      fontSize:11
    },
    inputView:{
      width:"100%",
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
    },
    loginBtn:{
      width:"100%",
      backgroundColor:"#912427",
      borderRadius:40,
      height:25,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
      marginBottom:10,
      marginRight:30,
      marginLeft:-10,
    },
    loginBtn2:{
      width:"80%",
      backgroundColor:"#912427",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      alignSelf:"center",
      marginTop:5,
    },
    loginText:{
      color:"white"
    },
    checkboxContainer: {
        marginBottom: 10,
    },
    loginBtn3:{
      width:"40%",
      backgroundColor:"#912427",
      borderRadius:40,
      height:25,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
      marginBottom:10,
      marginRight:20,
      marginLeft:20
    },
  });
    
export default connect(mapStateToProps, mapDispatchToProps)(User);