import React, { Component } from 'react';
import { Button, Text } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component{





  logout = async () => {
          let token = await AsyncStorage.getItem('@session_token');
          await AsyncStorage.removeItem('@session_token');
          return fetch("http://localhost:3333/api/1.0.0/logout", {
              method: 'post',
              headers: {
                  "X-Authorization": token
              }
          })
          .then((response) => {
              if(response.status === 200){
                  this.props.navigation.navigate("Login");
              }else if(response.status === 401){
                  this.props.navigation.navigate("Login");
              }else{
                  throw 'Something went wrong';
              }
          })
          .catch((error) => {
              console.log(error);
              ToastAndroid.show(error, ToastAndroid.SHORT);
          })
    }

    render(){
        return (
            <ScrollView>
                <Text>
                  Logout screen
                </Text>

                <Button
                    title="Log Out"
                    color="darkblue"
                    onPress={() => this.logout()}
                />
            </ScrollView>
        )
    }
}

export default Logout;
