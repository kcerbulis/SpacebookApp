import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Button} from 'reactstrap';

class Signup extends Component {
  constructor(props) {
    super(props);

    // Stores Signup data
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

    // Creates new user account with credentials
    signup = () =>
      // Signup request to server
      fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          console.log(response.status);
          // Error handling
          if (response.status == 201) {
            alert('Account Created');
            this.props.navigation.navigate('Login');
            return response.json();
          } if (response.status == 400) {
            alert('Bad Request\nPlease Check Your Input and Try Again');
          } else if (response.status == 401) {
            alert('Unauthorised to Create Account\nPlease Try Again Later');
          } else if (response.status == 403) {
            alert('Forbidden to Create Account\nPlease Try Again Later');
          } else if (response.status == 404) {
            alert('Not Found\nPlease Try Again Later');
          } else if (response.status == 500) {
            alert('A Server Error Has Occurred, Please Try Again Later');
          } else {
            throw 'Uncought Error Occured';
          }
        })
        .then((responseJson) => {
          console.log('User created with ID: ', responseJson);
        })
        .catch((error) => {
          console.log(error);
        })

    // Signup text input fields, updates state on key change
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <TextInput style={styles.textInput} placeholder="Enter your first name..." onChangeText={(first_name) => this.setState({ first_name })} value={this.state.first_name}/>
            <TextInput style={styles.textInput} placeholder="Enter your last name..." onChangeText={(last_name) => this.setState({ last_name })} value={this.state.last_name}/>
            <TextInput style={styles.textInput} placeholder="Enter your email..." onChangeText={(email) => this.setState({ email })} value={this.state.email}/>
            <TextInput style={styles.textInput} placeholder="Enter your password..." onChangeText={(password) => this.setState({ password })} value={this.state.password} secureTextEntry="true"/>
          </View>
          <View style={styles.buttonContainer}>
            <Button outline color="primary" onClick={() => this.signup()}>Create an account</Button>
            <Button outline color="primary" onClick={() => this.props.navigation.goBack()}>Back</Button>
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
  },
});

export default Signup;
