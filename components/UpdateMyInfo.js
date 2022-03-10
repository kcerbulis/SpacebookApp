import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateMyInfo extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      userInfo: [],
      updatedName: "",
      updatedLast: "",
      updatedEmail: "",
      updatedPassword: "",
    }
  }

  componentDidMount(){
    this.loadInformation();
  }

  loadInformation = async () => {
    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    //Gets user ID
    const id = await AsyncStorage.getItem('@session_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
              return response.json()
            }else if(response.status === 401){
              alert("Unauthorised! You need to log in!")
              this.props.navigation.navigate("Login");
            }else if(response.status === 404){
              alert("Couldn't Find Profile Information!")
            }else if(response.status === 500){
              alert("Server Error - Not Your Fault ;)")
              this.props.navigation.navigate("Login");
            }else{
                alert("An uncaught error has occored");
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            userInfo: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  updateUserInformation = async () => {
    //Checks if text field has changes
    //If no change, sets original state value to update
    //If change, sets new value in state
    if (Object.keys(this.state.updatedName).length == 0) {
      this.state.updatedName = this.state.userInfo.first_name;
    }
    if (Object.keys(this.state.updatedLast).length == 0) {
      this.state.updatedLast = this.state.userInfo.last_name;
    }
    if (Object.keys(this.state.updatedEmail).length == 0) {
      this.state.updatedEmail = this.state.userInfo.email;
    }
    if (Object.keys(this.state.updatedPassword).length == 0) {
      this.state.updatedPassword = this.state.userInfo.first_name;
    }

    //Formats body to send to server
    const body = {
      first_name: this.state.updatedName,
      last_name: this.state.updatedLast,
      email: this.state.updatedEmail,
      password: this.state.updatedPassword
    }

    //Gets my user token and ID
    const userID = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + userID, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization':  value
      },
      body: JSON.stringify(body)
    })
    //Result and error handling
    .then((response) => {
        if(response.status === 200){
            alert("Information Updated!")
            return response.json()
        }else if(response.status === 400){
          alert("Incorrect Format, Please Try Again!")
        }else if(response.status === 401){
          alert("Unauthorised! You need to log in!")
          this.props.navigation.navigate("Login");
        }else if(response.status === 403){
          alert("You are not allowed to change this information")
          this.props.navigation.goBack();
        }else if(response.status === 404){
          alert("Couldn't Find Profile Information!")
        }else if(response.status === 500){
          alert("Server Error - Not Your Fault ;)")
          this.props.navigation.navigate("Login");
        }else{
            alert("An uncaught error has occored");
        }
    })
    .then((responseJson) => {
      console.log("Need to go back")
    })
    .catch((error) => {
        console.log(error);
    })
  }

  render(){
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
    }else{
      return (
        <ScrollView>
          <View>
            <TextInput defaultValue={this.state.userInfo.first_name} onChangeText={value => this.setState({updatedName: value})}/>
            <TextInput defaultValue={this.state.userInfo.last_name} onChangeText={value => this.setState({updatedLast: value})}/>
            <TextInput defaultValue={this.state.userInfo.email} onChangeText={value => this.setState({updatedEmail: value})}/>
            <TextInput placeholder="New password..." secureTextEntry onChangeText={value => this.setState({updatedPassword: value})}/>
          </View>
          <Button title="Save Changes" onPress={() => this.updateUserInformation()}/>
          <Button title="Change Profile Photo" onPress={() => this.props.navigation.navigate("TakePhoto")}/>
          <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
        </ScrollView>
      );
    }
  }
}

export default UpdateMyInfo;
