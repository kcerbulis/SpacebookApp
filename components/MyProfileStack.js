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
import UpdateMyInfo from './UpdateMyInfo';
import TakePhoto from './TakePhoto';



const Stack = createNativeStackNavigator();

class MyProfileStack extends Component {

  constructor(props){
    super(props);
  }











  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="MyProfileView - 6,7,15" component={MyProfileView} options={{headerShown: false}}/>
        <Stack.Screen name="MyPosts" component={MyPosts} options={{headerShown: false}}/>
        <Stack.Screen name="MyPost" component={MyPost} options={{headerShown: false}}/>
        <Stack.Screen name="FriendRequests" component={FriendRequests} options={{headerShown: false}}/>
        <Stack.Screen name="SeeFriends" component={SeeFriends} options={{headerShown: false}}/>
        <Stack.Screen name="UpdateMyInfo" component={UpdateMyInfo} options={{headerShown: false}}/>
        <Stack.Screen name="TakePhoto" component={TakePhoto} options={{headerShown: false}}/>
      </Stack.Navigator>
    );
  }

}

const styles = StyleSheet.create({
});

export default MyProfileStack
