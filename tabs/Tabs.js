import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { FlatList, Text, Touchable, TouchableOpacity, View, Image } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;


const Tabs = ({data}) => {
    const navigation = useNavigation();

    return (
        <FlatList 
        data = {data} 
        horizontal
        keyExtractor = {(item) => item.id}
        renderItem={({item}) => (
            <TouchableOpacity
                onPress={() => navigation.navigate(item.screen)}
                disabled={item.disabled}
                style={[{width : windowWidth/2, backgroundColor:"#912427", 
                alignItems:"center",
                justifyContent:"center"}, item.disabled ? {backgroundColor:"#FF0606"} : {backgroundColor:"#912427"}]}
            >
                <View style={{flexDirection:'row'}}>
                    <Image
                    style = {{
                        width: 50,
                        height: 50,
                        resizeMode: "contain",
                    }}
                    source={{
                        uri: item.image
                    }} 
                    />
                    <Text style={{color:"white"}}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )}
        />
    )
}

export default Tabs