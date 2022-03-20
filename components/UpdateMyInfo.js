import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { Button } from 'reactstrap';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateMyInfo extends Component {
  constructor(props) {
    super(props);

    // Store current user info and info to update and loading state
    this.state = {
      isLoading: true,
      userInfo: [],
      updatedName: '',
      updatedLast: '',
      updatedEmail: '',
      updatedPassword: '',
    };
  }

  // Loads user information when page loads
  componentDidMount() {
    this.loadInformation();
  }

  // Retrieves user information and passes to state
  loadInformation = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Gets user ID
    const id = await AsyncStorage.getItem('@session_id');
    // Get user information server request
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        // Error handling
        if (response.status == 200) {
          return response.json();
        } if (response.status == 400) {
          alert('Bad Request\nPlease Try Again');
          this.props.navigation.goBack();
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nCan’t See This Users Information ');
          this.props.navigation.goBack();
        } else if (response.status == 404) {
          alert('User Information Not Found\nPlease Try Again Later');
          this.props.navigation.goBack();
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
          this.props.navigation.goBack();
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .then((responseJson) => {
        // Passes result into state, stops loading view
        this.setState({
          isLoading: false,
          userInfo: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Sends update request with updated info, passes it to state
  updateUserInformation = async () => {
    // Checks if text field has changes
    // If no change, sets original state value to update
    // If change, sets new value in state
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
    // Formats body to send to server
    const body = {
      first_name: this.state.updatedName,
      last_name: this.state.updatedLast,
      email: this.state.updatedEmail,
      password: this.state.updatedPassword,
    };
    // Gets my user token and ID
    const userID = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');

    // Patch request to update user information
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(body),
    })
    // Result and error handling
      .then((response) => {
        // Error handling
        if (response.status === 200) {
          alert('Information Updated');
          this.props.navigation.goBack();
          return response.json();
        } if (response.status === 400) {
          alert('Incorrect Format, Please Try Again!');
        } else if (response.status === 401) {
          alert('Unauthorised\nYou Need to Log In');
          this.props.navigation.navigate('Login');
        } else if (response.status === 403) {
          alert('You Are Not Allowed to Change This Information');
          this.props.navigation.goBack();
        } else if (response.status === 404) {
          alert("Couldn't Find Profile Information");
          this.props.navigation.goBack();
        } else if (response.status === 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
          this.props.navigation.goBack();
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // If loading state is true, show loading screen
  // Text fields show current informtaion, capable of changing text and submitting it
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{
          flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}
        >
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textContainer}>
            <TextInput style={styles.textInput} defaultValue={this.state.userInfo.first_name} onChangeText={(value) => this.setState({ updatedName: value })} />
            <TextInput style={styles.textInput} defaultValue={this.state.userInfo.last_name} onChangeText={(value) => this.setState({ updatedLast: value })} />
            <TextInput style={styles.textInput} defaultValue={this.state.userInfo.email} onChangeText={(value) => this.setState({ updatedEmail: value })} />
            <TextInput style={styles.textInput} placeholder="New password..." secureTextEntry onChangeText={(value) => this.setState({ updatedPassword: value })} />
          </View>
          <View style={styles.buttonContainer}>
            <Button color="primary" onClick={() => this.updateUserInformation()}>Save</Button>
            <Button color="success" onClick={() => this.props.navigation.navigate('TakePhoto')}>New Profile Photo</Button>
            <Button color="info" onClick={() => this.props.navigation.navigate('Accessibility')}>Accessibility</Button>
            <Button color="primary" outline onClick={() => this.props.navigation.goBack()}>Back</Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Styling
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e5f6ff',
  },

  textContainer: {
    height: 'auto',
    width: '40%',
    minWidth: 200,
    marginTop: '1%',
  },

  textInput: {
    fontWeight: 500,
    padding: 13,
    borderWidth: 1,
    borderRadius: 40,
    margin: 8,
  },

  buttonContainer: {
    height: '55%',
    width: '90%',
    justifyContent: 'space-evenly',
    marginTop: '2%',
  },
});

export default UpdateMyInfo;
