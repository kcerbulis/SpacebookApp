import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchUsers from './SearchUsers';
import UserPosts from './UserPosts';
import SeeUserFriends from './SeeUserFriends';
import UserInfo from './UserInfo';
import UserPost from './UserPost';
import Profile from './Profile';
import Posts from './Posts';

const Stack = createNativeStackNavigator();

class SearchStack extends Component {
  constructor(props){
    super(props);
  }


  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.setItem('@postsState', 'user');
      AsyncStorage.setItem('@profileState', 'user');
    });
  }



  render() {
    return(
      <Stack.Navigator initialRouteName="SearchUsers">
        <Stack.Screen name="SearchUsers" options={{headerShown:false}} component={SearchUsers} />
        <Stack.Screen name="UserPosts" options={{headerShown:false}} component={UserPosts} />
        <Stack.Screen name="SeeUserFriends" options={{headerShown:false}} component={SeeUserFriends} />
        <Stack.Screen name="UserInfo" options={{headerShown:false}} component={UserInfo} />
        <Stack.Screen name="UserPost" options={{headerShown:false}} component={UserPost} />
        <Stack.Screen name="Profile" options={{headerShown:false}} component={Profile} />
        <Stack.Screen name="PostsUser" options={{headerShown:false}} component={Posts} />
      </Stack.Navigator>
    )
  }
}

const styles = StyleSheet.create({
});

export default SearchStack
