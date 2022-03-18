import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login'
import Signup from './components/Signup'
import Main from './components/Main'

const Stack = createNativeStackNavigator();

class App extends Component {

  //Stack navigator for main components
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" options={{headerShown:false}} component={Login} />
          <Stack.Screen name="Signup" options={{headerShown:false}} component={Signup} />
          <Stack.Screen name="Main" options={{headerShown:false}} component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
export default App;
