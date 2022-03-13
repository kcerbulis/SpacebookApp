import React, { Component } from 'react';
import { Button, Text, Alert, Modal, StyleSheet, Pressable, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component{

  state = {
    modalVisible: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }



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
