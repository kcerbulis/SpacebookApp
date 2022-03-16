import React, { Component } from 'react';
import { Button } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    // Stores login data
    this.state = {
      email: '',
      password: '',
    };
  }

    // Logs in user with correct credentials
    login = async () =>
      // Login POST request to the server
      fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          // Error handling
          if (response.status == (200 || 201)) {
            return response.json();
          } if (response.status === 400) {
            alert('Email or Username Invalid\nPlease Create an Account if You Don’t Have One');
          } else if (response.status === 401) {
            alert('Unauthorised to Log In\nPlease Create an Account Or Try Again Later');
            this.props.navigation.navigate('Signup');
          } else if (response.status === 403) {
            alert('Forbidden to Log In\nPlease Create an Account Or Try Again Later');
            this.props.navigation.navigate('Signup');
          } else if (response.status === 404) {
            alert('Profile Not Found \nPlease Create an AccountPlease Create an Account Or Try Again Later');
            this.props.navigation.navigate('Signup');
          } else if (response.status === 500) {
            alert('A Server Error Has Occurred, Please Try Again Later');
          } else {
            alert('An Uncaught Error Has Occurred :(\nPlease Try Again Later');
          }
        })
        .then(async (responseJson) => {
          // Stores tokens, ID's and view states in AsyncStorage
          await AsyncStorage.setItem('@session_id', responseJson.id);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          await AsyncStorage.setItem('@profileState', 'mine');
          await AsyncStorage.setItem('@postsState', 'mine');
          //Checks if there are drafts present
          try {
            const draftCount = await AsyncStorage.getItem('@draftCount');
          }
          //If no drafts present, set the count to 0
          catch{
            await AsyncStorage.setItem('@draftCount', 0);
          }
          // Navigates user to the landing page of the application
          this.props.navigation.navigate('Main');
        })
        .catch((error) => {
          console.log(error);
        })

    render() {
      // Login text fields and buttons
      return (
        <ScrollView>
          <TextInput placeholder="Enter your email..." onChangeText={(email) => this.setState({ email })} value={this.state.email} style={{ padding: 5, borderWidth: 1, margin: 5 }} />
          <TextInput placeholder="Enter your password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry style={{ padding: 5, borderWidth: 1, margin: 5 }} />
          <Button title="Login" onPress={() => this.login()} />
          <Button title="Create an account" color="darkblue" onPress={() => this.props.navigation.navigate('Signup')} />
        </ScrollView>
      );
    }
}

export default LoginScreen;
