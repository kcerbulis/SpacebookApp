import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Button, StyleSheet, Alert, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera } from 'expo-camera';



class UserProfileView extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      photo: '',
      listData: [],

    }
  }

  componentDidMount(){

    this.greetUser()

    this.displayProfilePhoto();



  }

  greetUser = async () => {

    const test = await AsyncStorage.getItem('@user_id');



    console.log("Profile for user " + test)

  }


  displayProfilePhoto = async () => {

    console.log("Is run")

    // const value = await AsyncStorage.getItem('@session_token');
    // const userID = await AsyncStorage.getItem('@session_id');
    //
    //
    // return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
    //       'headers': {
    //         'X-Authorization':  value
    //       }
    // })
    // .then((res) => {
    //   return res.blob()
    // })
    // .then((resBlob) => {
    //   let data = URL.createObjectURL(resBlob);
    //   console.log(data)
    //   this.setState({
    //     photo: data,
    //     isLoading: false
    //   });
    // })
    // .catch((err) => {
    //   console.log("error", err)
    // });


  }













  render() {
    return (
      <ScrollView>

        <Text>This is user profile view</Text>

        <Button title="Back" onPress={() => this.props.navigation.goBack()}/>

      </ScrollView>

    );
  }

}



export default UserProfileView
