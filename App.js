import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Provider } from 'react-redux';
import LoginPage from './screens/LoginPage';
import MainPage from './screens/MainPage';
import SignUpPage from './screens/SignUpPage';
import Lobby from './screens/Lobby';
import SongsPage from './screens/SongsPage';
import Rockolas from './screens/Rockolas';
import ListofListsfromRockola from './screens/ListofListsfromRockola'
import MyRockolas from './screens/MyRockolas'
import MyLists from './screens/MyLists'
import User from './screens/User'
import { store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditList from './screens/EditList';
import ListasFavoritos from './screens/ListasFavoritos';
import RockolasFavoritos from './screens/RockolasFavoritos';
import AddFriends from './screens/AddFriends'

export default function App() {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style= {{ flex: 1}}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
            <Stack.Navigator>
              <Stack.Screen
              name='LoginPage'
              component={LoginPage}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='MainPage'
              component={MainPage}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='SignUpPage'
              component={SignUpPage}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='Lobby'
              component={Lobby}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='SongsPage'
              component={SongsPage}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='Rockolas'
              component={Rockolas}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='ListofListsfromRockola'
              component={ListofListsfromRockola}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='MyLists'
              component={MyLists}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='MyRockolas'
              component={MyRockolas}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='User'
              component={User}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='EditList'
              component={EditList}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='ListasFavoritos'
              component={ListasFavoritos}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='RockolasFavoritos'
              component={RockolasFavoritos}
              options={{
                headerShown: false,
              }}
              />
              <Stack.Screen
              name='AddFriends'
              component={AddFriends}
              options={{
                headerShown: false,
              }}
              />
            </Stack.Navigator> 
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}