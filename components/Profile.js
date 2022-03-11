import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Button, StyleSheet, Alert, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera } from 'expo-camera';

//Main class for displaying Profile content
class Profile extends Component {


  constructor(props){
    super(props);

    //States used to store and display information
    this.state = {
      isLoading: true,
      photo: '',
      photoUser: '',
      profileState: '',
      listData: [],
      isFriend: false,

    }
  }

  componentDidMount(){
    //Checks if Mine or User profile
    this.checkWhosProfile();

    //Allows new profile photo to be seen immedietly after upload
    this.focus = this.props.navigation.addListener('focus', () => {
      this.updateProfilePhoto();
    });

  }

  checkWhosProfile = async () => {
    //Stores who's profile needs to be displayed
    let profileState = await AsyncStorage.getItem('@profileState');

    //Sets state of whos profile looking at
    await this.setState({
      profileState: profileState
    })
    //If profile not mine, checks if user is my friend and display profile photo
    if(profileState == 'user'){
      console.log("Looking at NOT my profile")
      this.checkIfFriend();
      this.displayProfilePhotoUser();
    }
  }

  checkIfFriend = async () => {
    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    //Gets user ID
    const id = await AsyncStorage.getItem('@user_id');

    //Only returns without erro if friend, used as a check
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 403){
              //NOT FRIEND = Update State
              this.setState({
                isFriend: false
              })
            }
            else(
              //FRIEND = Update State
              this.setState({
                isFriend: true
              })
            )
            console.log("This is my friend = " + this.state.isFriend)
        })
  }

  //When a new profile picture is takes, updated picture shown
  updateProfilePhoto = async () => {
    this.displayProfilePhoto();
  }

  displayProfilePhoto = async () => {
    //Gets my user ID
    const userID = await AsyncStorage.getItem('@session_id');
    //Gets my seesion token
    const value = await AsyncStorage.getItem('@session_token');

    //Gets photo from server
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
          'headers': {
            'X-Authorization':  value
          }
    })
    .then((res) =>{
      //Formats result into blob
      return res.blob()
    })
    .then((resBlob) => {
      //Formats blob into object URL
      let data = URL.createObjectURL(resBlob);
      //Passes data to state for display
      this.setState({
        photo: data,
        isLoading: false
      });
    }
    )
    .catch((err) => {
      console.log("error", err)
    });
  }

  displayProfilePhotoUser = async () => {
    //Gets user ID
    const userID = await AsyncStorage.getItem('@user_id');
    //Gets my seesion token
    const value = await AsyncStorage.getItem('@session_token');

    //Gets user photo from server
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
          'headers': {
            'X-Authorization':  value
          }
    })
    .then((res) => {
      //Formats result into blob
      return res.blob()
    })
    .then((resBlob) => {
      //Formats blob into object URL
      let data = URL.createObjectURL(resBlob);
      //Passes data to state for display
      this.setState({
        photoUser: data,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log("error", err)
    });
  }

  sendFriendRequest = async () => {
    //Gets user ID
    const userID = await AsyncStorage.getItem('@user_id');
    //Gets my seesion token
    const value = await AsyncStorage.getItem('@session_token');

    //Sends friend request to server
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/friends", {
          method: 'post',
          headers: {
              'Content-Type': 'application/json',
              'X-Authorization':  value
          }
      })
      .then((response) => {
          if(response.status === 200){
              alert("Friend Request Sent")
              return response.json()
          }else if(response.status === 201){
              alert("Friend Request Sent")
              return response.json()
          }else if(response.status === 401){
              alert("Unauthorised")
          }else if(response.status === 403){
              alert("Friend Request Pending")
          }else if(response.status === 404){
              alert("User Not Found")
          }
          else if(response.status === 500){
              alert("Server Error")
          }else{
              throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
      })
      .catch((error) => {
          console.log(error);
      })
  }

  goToUserPosts = async () => {
    console.log("Taken to user posts")

    await AsyncStorage.setItem('@postsState', 'user');

    const userID = await AsyncStorage.getItem('@user_id');
    const postState = await AsyncStorage.getItem('@postsState');

    console.log(userID + " " + postState)

    this.props.navigation.navigate("PostsUser");
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

      }else if (this.state.profileState == 'mine') {
        return(
          <ScrollView>
            <Image source={{uri: this.state.photo,}} style={{width: 400,height: 400}}/>
            <Button title="My Post" onPress={() => this.props.navigation.navigate("Posts")}/>
            <Button title="Friend Request" onPress={() => this.props.navigation.navigate("FriendRequests")}/>
            <Button title="Friend List" onPress={() => this.props.navigation.navigate("SeeFriends")}/>
            <Button title="My Info" onPress={() => this.props.navigation.navigate("UpdateMyInfo")}/>
          </ScrollView>
        )
      }

      else if (this.state.profileState == 'user') {
        if(this.state.isFriend) {
          return(
            <ScrollView>
              <Image source={{uri: this.state.photoUser,}} style={{width: 400,height: 400}}/>
              <Button title="Post" onPress={() => this.goToUserPosts()}/>
              <Button title="View Friends" onPress={() => this.props.navigation.navigate("SeeUserFriends")}/>
              <Button title="User Info" onPress={() => this.props.navigation.navigate("UserInfo")}/>
              <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
            )
        }
        else{
          return(
            <ScrollView>
              <Image source={{uri: this.state.photoUser,}} style={{width: 400,height: 400}}/>
              <Button title="User Info" onPress={() => this.props.navigation.navigate("UserInfo")}/>
              <Button title="Send Friend Request" onPress={() => this.sendFriendRequest()}/>
              <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>

          )
        }
      }
  }

}

const styles = StyleSheet.create({
});

export default Profile
