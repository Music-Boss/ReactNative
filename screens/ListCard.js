import * as React from 'react';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="playlist-play" />

const ListCard = ({lista}) => (
  <Card>
    <Card.Title title={lista.nombre} subtitle={lista.usuario == null ? "Usuario Anónimo" : lista.usuario} left={LeftContent} />
    <Card.Content>
      <Title>Fecha de Creación</Title>
      <Paragraph>{lista.fechaCreacion}</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/id/145/500' }} />
    {/*<Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
    */}
  </Card>
);

export default ListCard;