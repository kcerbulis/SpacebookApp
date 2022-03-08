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
    this.loadPosts();
  }


  updateInfo = async () =>{
    console.log("Info is updated")
  }


  loadPosts = async () => {





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
              alert("You need to log in")
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          console.log(responseJson)
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



    if (Object.keys(this.state.updatedName).length == 0) {
      this.state.updatedName = this.state.userInfo.first_name;
      console.log(this.state.updatedName)
    }


    if (Object.keys(this.state.updatedLast).length == 0) {
      this.state.updatedLast = this.state.userInfo.last_name;
      console.log(this.state.updatedLast)
    }


    if (Object.keys(this.state.updatedEmail).length == 0) {
      this.state.updatedEmail = this.state.userInfo.email;
      console.log(this.state.updatedEmail)
    }

    console.log(this.state.updatedPassword)
    if (Object.keys(this.state.updatedPassword).length == 0) {
      this.state.updatedPassword = this.state.userInfo.first_name;
        console.log(this.state.updatedPassword)
    }



    const body = {
      first_name: this.state.updatedName,
      last_name: this.state.updatedLast,
      email: this.state.updatedEmail,
      password: this.state.updatedPassword
    }

    console.log(JSON.stringify(body))


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
    .then((response) => {
        console.log(response.status)
        this.props.navigation.goBack();
        alert("User Information Updated")
        if(response.status === 200){
            return response.json()
        }else if(response.status === 400){
            throw 'Failed validation';
        }else{
            throw 'Something went wrong ' + response.status;
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

          <TextInput
            defaultValue={this.state.userInfo.first_name}
            onChangeText={value => this.setState({updatedName: value})}
          />

          <TextInput
            defaultValue={this.state.userInfo.last_name}
            onChangeText={value => this.setState({updatedLast: value})}
          />

          <TextInput
            defaultValue={this.state.userInfo.email}
            onChangeText={value => this.setState({updatedEmail: value})}
          />

          <TextInput
              placeholder="New password..."
              secureTextEntry
              onChangeText={value => this.setState({updatedPassword: value})}
          />


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
