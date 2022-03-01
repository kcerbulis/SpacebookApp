import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import MyPosts from './MyPosts';
import MyPost from './MyPost';
import MyProfileView from './MyProfileView';
import FriendRequests from './FriendRequests';
import SeeFriends from './SeeFriends';
import UpdateMyInfo from './UpdateMyInfo'



const Stack = createNativeStackNavigator();

class MyProfileStack extends Component {

  constructor(props){
    super(props);
  }











  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="MyProfileView - 6,7,15" component={MyProfileView} />
        <Stack.Screen name="MyPosts" component={MyPosts} />
        <Stack.Screen name="MyPost" component={MyPost} />
        <Stack.Screen name="FriendRequests" component={FriendRequests} />
        <Stack.Screen name="SeeFriends" component={SeeFriends} />
        <Stack.Screen name="UpdateMyInfo" component={UpdateMyInfo} />
      </Stack.Navigator>
    );
  }

}

const styles = StyleSheet.create({
});

export default MyProfileStack
