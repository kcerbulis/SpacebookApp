import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button} from 'reactstrap';

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
          console.log("My id is " + responseJson.id + " My token is " + responseJson.token)
          await AsyncStorage.setItem('@profileState', 'mine');
          await AsyncStorage.setItem('@postsState', 'mine');

          //Gets number of drafts
          const draftCount = await AsyncStorage.getItem('@draftCount');

          //If there is no number, set it to 0
          if(isNaN(draftCount) || (draftCount == null)){
            await AsyncStorage.setItem('@draftCount', 0);
          }
          // Navigates user to the landing page of the application
          this.props.navigation.navigate('Main');
        })
        .catch((error) => {
          console.log(error);
        })

    onCheckboxBtnClick = async (selected) => {
        console.log("THis is pressed")
      }

    render() {
      // Login text fields and buttons
      return (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <TextInput style={styles.textInput} placeholder="Enter your email..." onChangeText={(email) => this.setState({ email })} value={this.state.email} />
            <TextInput style={styles.textInput} placeholder="Enter your password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry/>
          </View>
          <View style={styles.buttonContainer}>
            <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.login()} >Login</Button>
            <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.props.navigation.navigate('Signup')}>Signup</Button>
          </View>
        </View>
      );
    }
}

// Styling
const styles = StyleSheet.create({

  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: 'center',
    backgroundColor: "#e5f6ff"
  },

  textContainer: {
    height: "auto",
    width: "40%",
    minWidth: 200,
    marginTop: "1%",
  },

  textInput: {
    fontWeight: 500,
    padding: 13,
    borderWidth: 1,
    borderRadius: 40,
    margin: 8
  },

  buttonContainer: {
    height: "auto",
    width: "20%",
    justifyContent: 'space-evenly',
    marginTop: "2%",
    flexDirection: 'row',
  }
});


export default LoginScreen;
