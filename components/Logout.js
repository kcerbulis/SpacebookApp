import React, { Component } from 'react';
import { Button, Text, Alert, Modal, StyleSheet, Pressable, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component{
  //logout popup state
  state = {
    modalVisible: false
  };
  //Changes popup visibility
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  //Logs user out of session
  logout = async () => {
    //Gets session token
    let token = await AsyncStorage.getItem('@session_token');
    //Crears session token from async memmory
    await AsyncStorage.removeItem('@session_token');
    //Logout server request
    return fetch("http://localhost:3333/api/1.0.0/logout", {
        method: 'post',
        headers: {
            "X-Authorization": token
        }
    })
    .then((response) => {
        //Error handling
        if(response.status === 200){
            this.props.navigation.navigate("Login");
        }else if(response.status === 400){
            alert("Bad Request\nPlease Try Again")
        }else if(response.status === 401){
            alert("Unauthorised\nPlease Try Again Later")
        }else if(response.status === 403){
            alert("Forbidden\nPlease Try Again Later")
        }else if(response.status === 404){
            alert("Not Found\nPlease Try Again Later")
        }else if(response.status === 500){
            alert("A Server Error Has Occurred, Please Try Again Later");
        }else{
            throw "Uncought Error Occured";
        }
    })
    .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
    })
  }

  //Modal setup as a popup alternative to confirm logout
  render(){
    const { modalVisible } = this.state;
    return (
      <View  style={styles.container}>
        <Pressable onPress={() => this.setModalVisible(true)}>
          <Text>Log Out</Text>
        </Pressable>
        <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => {this.setModalVisible(!modalVisible);}}>
          <View style={styles.popUpContainer}>
            <Text>Are you sure you want to log out?</Text>
            <Pressable onPress={() => this.logout()}>
              <Text>Log Out</Text>
            </Pressable>
            <Pressable onPress={() => this.setModalVisible(!modalVisible)}>
              <Text>Stay</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  popUpContainer: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
});

export default Logout;
