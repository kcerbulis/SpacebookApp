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
      isFriend: false

    }
  }

  componentDidMount(){
    this.displayProfilePhoto();

    this.checkIfFriend();
  }


  checkIfFriend = async () => {

    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    //Gets user ID
    const id = await AsyncStorage.getItem('@user_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 403){
                console.log("This is not my friend")


            }
            else(

              this.setState({
                isFriend: true
              })

            )

        })
  }

























  sendFirendRequest = async () => {
    console.log("Friend Request sent")

    const value = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@user_id');


    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/friends", {
          method: 'post',
          headers: {
              'Content-Type': 'application/json',
              'X-Authorization':  value
          }
      })
      .then((response) => {
        console.log(response.status)
          if(response.status === 201){
              return response.json()
          }else if(response.status === 400){
              throw 'Failed validation';
          }
          else if(response.status === 403){
              alert("Friend Request Pending")
          }else{
              throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
        console.log(responseJson)
      })
      .catch((error) => {
          console.log(error);
      })


  }

































  displayProfilePhoto = async () => {

    const value = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@user_id');




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







      if(this.state.isLoading){
        return(
          <View
            style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text>Loading</Text>
          </View>
        );
      }else if (this.state.isFriend) {
        return(
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
                title="Post"
                onPress={() => this.props.navigation.navigate("UserPosts")}
            />


            <Button
                title="View Friends"
                onPress={() => this.props.navigation.navigate("SeeUserFriends")}
            />


            <Button
                title="User Info"
                onPress={() => this.props.navigation.navigate("UserInfo")}
            />



            <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
          </ScrollView>

        )
      }else{
        return(
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
                title="User Info"
                onPress={() => this.props.navigation.navigate("UserInfo")}
            />

            <Button
                title="Send Friend Request"
                onPress={() => this.sendFirendRequest()}
            />

            <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
          </ScrollView>

        )
      }












  }

}

const styles = StyleSheet.create({
});

export default UserProfileView
