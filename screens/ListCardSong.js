import * as React from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import OptionsMenu from "react-native-option-menu";
import { useNavigation } from '@react-navigation/native';
import SongsPage from './SongsPage'

const LeftContent = props => <Avatar.Icon {...props} icon="playlist-play" />


const ListCardSong = ({lista}) => (
  <Card>
    <Card.Title title={lista.nombre} subtitle={lista.artista} left={LeftContent} />
    <Card.Content>
      <Title>Fecha de Publicación</Title>
      <Paragraph>{lista.fechaCreacion === null ? '' : lista.fechaCreacion}</Paragraph>
      
    </Card.Content>
    <Card.Cover source={{ uri: 'https://img.youtube.com/vi/'+lista.fuente+'/hqdefault.jpg'}} />
    {/*<Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
    */}
  </Card>
);

export default ListCardSong;