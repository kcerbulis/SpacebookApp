import React, { Component } from 'react';
import {
  Text, TextInput, View, ScrollView, Button, StyleSheet, Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importing all relavent componenets
import SearchStack from './SearchStack';
import MyProfileStack from './MyProfileStack';
import Logout from './Logout';

// Allows tab navigation
const Tab = createBottomTabNavigator();

class Main extends Component {
  constructor(props) {
    super(props);

    // Stores changable data
    this.state = {
      isLoading: true,
      listData: [],
    };
  }

  // Whenever the screen in focused, check if the user is logged in
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  // Before unmounting component, check if logged in
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Checks if access tokes is present in order to stay logged in
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    // If token is empty, redirect to login
    if (value == null) {
      Alert('You have been logged out');
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      // Conatins all accessible application tabs
      <Tab.Navigator initialRouteName="My Profile">
        <Tab.Screen name="Search" component={SearchStack} options={{ headerShown: false }} />
        <Tab.Screen name="My Profile" component={MyProfileStack} options={{ headerShown: false }} />
        <Tab.Screen name="Log Out" component={Logout} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }
}

// Styling
const styles = StyleSheet.create({
});

export default Main;
