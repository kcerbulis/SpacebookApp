import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchUsers from './SearchUsers';
import UserProfileView from './UserProfileView';

const Stack = createNativeStackNavigator();

class SearchStack extends Component {
  constructor(props){
    super(props);

  }



  render() {
    return(
      <Stack.Navigator initialRouteName="SearchUsers">
        <Stack.Screen name="SearchUsers" options={{headerShown:false}} component={SearchUsers} />
        <Stack.Screen name="UserProfileView" options={{headerShown:false}} component={UserProfileView} />
      </Stack.Navigator>
    )
  }
}

const styles = StyleSheet.create({
});

export default SearchStack
