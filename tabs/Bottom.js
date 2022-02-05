import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { FlatList, Text, Touchable, TouchableOpacity, View, Image } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../slices/navSlice';
import { Dimensions } from 'react-native';
import {selectUsername, selectToken, selectUserId, selectNoUser} from '../slices/navSlice'

const windowWidth = Dimensions.get('window').width;


const Bottom = ({data}) => {
    const navigation = useNavigation();
    const nou = useSelector(selectNoUser)

    return (
        <View>        
            {
            nou == true ?
        <FlatList 
        data = {data} 
        horizontal
        keyExtractor = {(item) => item.id}
        renderItem={({item}) => (
            <TouchableOpacity
                onPress={() => navigation.navigate(item.screen)}
                disabled={true}
                style={[{width : windowWidth/4,  
                alignItems:"center",
                justifyContent:"center"}, item.disabled == "true" ? {backgroundColor:"#BA3437"} : {backgroundColor:"#787878"}]}
            >
                <View style={{ height:50, flexDirection:'column', alignItems:"center", margin:5}}>
                    <Image
                    style = {{
                        width: 30,
                        height: 30,
                        resizeMode: "contain",
                    }}
                    source={{
                        uri: item.image
                    }} 
                    />
                    <View style={{flex: 1}}>
                    <Text style={{ color:"white"}}>{item.title}</Text>
                    </View>
                </View>
                
            </TouchableOpacity>
        )}
        />
        :
        <FlatList 
        data = {data} 
        horizontal
        keyExtractor = {(item) => item.id}
        renderItem={({item}) => (
            <TouchableOpacity
                onPress={() => navigation.navigate(item.screen)}
                //disabled={item.disabled}
                style={[{width : windowWidth/4,  
                alignItems:"center",
                justifyContent:"center"}, item.disabled == "true" ? {backgroundColor:"#BA3437"} : {backgroundColor:"#912427"}]}
            >
                <View style={{ height:50, flexDirection:'column', alignItems:"center", margin:5}}>
                    <Image
                    style = {{
                        width: 30,
                        height: 30,
                        resizeMode: "contain",
                    }}
                    source={{
                        uri: item.image
                    }} 
                    />
                    <View style={{flex: 1}}>
                    <Text style={{ color:"white"}}>{item.title}</Text>
                    </View>
                </View>
                
            </TouchableOpacity>
        )}
        />
    }
    </View>

    )
}

export default Bottom