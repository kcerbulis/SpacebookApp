import React, { Component } from 'react';
import {
  Text, TextInput, View, ScrollView, Button, StyleSheet, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing all relavent componenets
import Profile from './Profile';
import Posts from './Posts';
import MyPost from './MyPost';
import UserPost from './UserPost';
import FriendRequests from './FriendRequests';
import SeeFriends from './SeeFriends';
import UpdateMyInfo from './UpdateMyInfo';
import TakePhoto from './TakePhoto';
import Drafts from './Drafts';
import Accessibility from './Accessibility'

// Allows stack navigation
const Stack = createNativeStackNavigator();

class MyProfileStack extends Component {
  constructor(props) {
    super(props);
  }

  // When looking at My Profile tab, change the post and profile state to 'mine'
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      AsyncStorage.setItem('@postsState', 'mine');
      AsyncStorage.setItem('@profileState', 'mine');
    });
  }

  render() {
    return (
      // Conatins all accessible stack screens for My Profile tab
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="MyPost" component={MyPost} options={{ headerShown: false }} />
        <Stack.Screen name="FriendRequests" component={FriendRequests} options={{ headerShown: false }} />
        <Stack.Screen name="SeeFriends" component={SeeFriends} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateMyInfo" component={UpdateMyInfo} options={{ headerShown: false }} />
        <Stack.Screen name="TakePhoto" component={TakePhoto} options={{ headerShown: false }} />
        <Stack.Screen name="Posts" component={Posts} options={{ headerShown: false }} />
        <Stack.Screen name="UserPost" component={UserPost} options={{ headerShown: false }} />
        <Stack.Screen name="Drafts" component={Drafts} options={{ headerShown: false }} />
        <Stack.Screen name="Accessibility" component={Accessibility} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
}

// Styling
const styles = StyleSheet.create({
});

export default MyProfileStack;
