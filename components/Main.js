import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchStack from './SearchStack';
import MyProfileStack from './MyProfileStack';
import FriendRequests from './FriendRequests';
import Logout from './Logout';

const Tab = createBottomTabNavigator();

class Main extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }


  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }



  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };



  render(){
    return (





      <Tab.Navigator initialRouteName="Search Friends">
        <Tab.Screen name="Search" component={SearchStack}  />
        <Tab.Screen name="My Profile" component={MyProfileStack} options={{headerShown: false}}/>
        <Tab.Screen name="Friend Requests" component={FriendRequests} options={{headerShown: false}}/>
        <Tab.Screen name="Log Out" component={Logout} options={{headerShown: false}}/>
      </Tab.Navigator>





    );
  }

}

export default Main;
