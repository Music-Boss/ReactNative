import * as React from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import OptionsMenu from "react-native-option-menu";
import { useNavigation } from '@react-navigation/native';
import SongsPage from './SongsPage'
import { Icon } from 'react-native-elements'
import {setSongs} from '../slices/navSlice'
import { useDispatch } from 'react-redux';


const LeftContent = props => <Avatar.Icon {...props} icon="playlist-play" />

const myIcon = (<Icon
  name='menu'
  type='Feather'
  color='#000000'
/>)



const ListCard = ({lista}) => 
{
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const editPost = () => {
    console.log("edit post");
  }

  const goToList = () => {
    const songs = lista.canciones;
    dispatch(setSongs({songs}));
    navigation.navigate('SongsPage');
  }
  
  return(

  <Card>
    <Card.Title title={lista.nombre} subtitle={lista.usuario == null ? "Usuario Anónimo" : lista.usuario} left={LeftContent} />
    <Card.Content style = {{marginBottom: 20}}>
      <Title>Fecha de Creación</Title>
      <Paragraph>{lista.fechaCreacion}</Paragraph>
      
      <OptionsMenu
        customButton={myIcon}
        destructiveIndex={1}
        options={["Edit", "Go To List", "Cancel"]}
        actions={[editPost, goToList]}/>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/id/145/500' }} />
    {/*<Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
    */}
  </Card>
);
}

export default ListCard;