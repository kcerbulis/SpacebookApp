import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Importing all relavent componenets
import SearchUsers from './SearchUsers';
import Profile from './Profile';
import Posts from './Posts';
import UserPost from './UserPost';
import UserInfo from './UserInfo';
import SeeUserFriends from './SeeUserFriends';

//Allows stack navigation
const Stack = createNativeStackNavigator();

class SearchStack extends Component {
  constructor(props){
    super(props);
  }

  //When looking at Search tab, change the post and profile state to 'user'
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.setItem('@postsState', 'user');
      AsyncStorage.setItem('@profileState', 'user');
    });
  }

  render() {
    return(
      //Conatins all accessible stack screens for Search tab
      <Stack.Navigator initialRouteName="SearchUsers">
        <Stack.Screen name="SearchUsers" options={{headerShown:false}} component={SearchUsers} />
        <Stack.Screen name="SeeUserFriends" options={{headerShown:false}} component={SeeUserFriends} />
        <Stack.Screen name="UserInfo" options={{headerShown:false}} component={UserInfo} />
        <Stack.Screen name="UserPost" options={{headerShown:false}} component={UserPost} />
        <Stack.Screen name="Profile" options={{headerShown:false}} component={Profile} />
        <Stack.Screen name="PostsUser" options={{headerShown:false}} component={Posts} />
      </Stack.Navigator>
    )
  }
}

//Styling
const styles = StyleSheet.create({
});

export default SearchStack
