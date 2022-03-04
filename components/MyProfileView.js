import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Button, StyleSheet, Alert, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera } from 'expo-camera';



class MyProfileView extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      photo: '',
      listData: [],

    }
  }

  componentDidMount(){
    this.displayProfilePhoto();


  }




  displayProfilePhoto = async () => {

    const value = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@session_id');


    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
          'headers': {
            'X-Authorization':  value
          }
    })
    .then((res) => {
      return res.blob()
    })
    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob);
      console.log(data)
      this.setState({
        photo: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });


  }













  render() {
    return (
      <ScrollView>




















        <Image

          source={{
            uri: this.state.photo,
          }}

          style={{
            width: 400,
            height: 400
          }}
        />




        <Button
            title="My Post"
            onPress={() => this.props.navigation.navigate("MyPosts")}
        />


        <Button
            title="Friend Request"
            onPress={() => this.props.navigation.navigate("FriendRequests")}
        />

        <Button
            title="Friend List"
            onPress={() => this.props.navigation.navigate("SeeFriends")}
        />


        <Button
            title="My Info"
            onPress={() => this.props.navigation.navigate("UpdateMyInfo")}
        />









      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
});

export default MyProfileView
