import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateMyInfo extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      userInfo: []
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
          />

          <TextInput
            defaultValue={this.state.userInfo.last_name}
          />

          <TextInput
            defaultValue={this.state.userInfo.email}
          />

          <TextInput
              placeholder="New password..."
              secureTextEntry
          />


          </View>
          <Button title="Take Photo" onPress={() => this.props.navigation.navigate("TakePhoto")}/>
          <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
        </ScrollView>
      );
    }
  }


















}

export default UpdateMyInfo;
