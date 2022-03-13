import React, { Component } from 'react';
import { Button, ScrollView, TextInput } from 'react-native';

class Signup extends Component{
    constructor(props){
        super(props);

        //Stores Signup data
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    //Creates new user account with credentials
    signup = () => {


          return fetch("http://localhost:3333/api/1.0.0/user", {
              method: 'post',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.state)
          })
          .then((response) => {
              if(response.status === 201){
                  return response.json()
                  console.log("This is resoponse.json = " + response.json())
              }else if(response.status === 400){
                  throw 'Failed validation';
              }else{
                  throw 'Something went wrong';
              }
          })
          .then((responseJson) => {
                 console.log("User created with ID: ", responseJson);
                 this.props.navigation.navigate("Login");

          })
          .catch((error) => {
              console.log(error);
          })
      }

    render(){
        return (
            <ScrollView>
                <TextInput placeholder="Enter your first name..." onChangeText={(first_name) => this.setState({first_name})} value={this.state.first_name} style={{padding:5, borderWidth:1, margin:5}}/>
                <TextInput placeholder="Enter your last name..." onChangeText={(last_name) => this.setState({last_name})} value={this.state.last_name} style={{padding:5, borderWidth:1, margin:5}}/>
                <TextInput placeholder="Enter your email..." onChangeText={(email) => this.setState({email})} value={this.state.email} style={{padding:5, borderWidth:1, margin:5}}/>
                <TextInput placeholder="Enter your password..." onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry = 'true' style={{padding:5, borderWidth:1, margin:5}}/>
                <Button title="Create an account" onPress={() => this.signup()}/>
                <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
        )
    }
}

export default Signup;
