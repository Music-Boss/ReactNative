import * as React from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import OptionsMenu from "react-native-option-menu";
import { useNavigation } from '@react-navigation/native';
import SongsPage from './SongsPage'
import { Dimensions } from 'react-native';

const LeftContent = props => <Avatar.Icon {...props} icon="playlist-play" />

const windowWidth = Dimensions.get('window').width;

const ListCardSong = ({lista}) => (
    <Card style={{width : windowWidth*0.45, marginBottom:15, marginRight: 10, marginLeft: 10}}>
        <Card.Title title={lista.nombre} subtitle={lista.artista} />
        <Card.Content>
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