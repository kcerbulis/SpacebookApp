import React, { Component } from 'react';
import {
  Text, Alert, Modal, StyleSheet, Pressable, View,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'reactstrap';

class Logout extends Component {
  // Logs user out of session
  logout = async () => {
    // Gets session token
    const token = await AsyncStorage.getItem('@session_token');
    // Crears session token from async memmory
    await AsyncStorage.removeItem('@session_token');
    // Logout server request
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        // Error handling
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 400) {
          alert('Bad Request\nPlease Try Again');
        } else if (response.status === 401) {
          alert('Unauthorised\nPlease Try Again Later');
        } else if (response.status === 403) {
          alert('Forbidden\nPlease Try Again Later');
        } else if (response.status === 404) {
          alert('Not Found\nPlease Try Again Later');
        } else if (response.status === 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  }

  // Modal setup as a popup alternative to confirm logout
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoutBtnContainer}>
          <Button size="lg" outline color="danger" onClick={() => this.logout()}>Logout</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffd6e8',
  },

  logoutBtnContainer: {
    marginTop: '10%',
  },

});

export default Logout;
