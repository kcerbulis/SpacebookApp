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
      //Signup request to server
      return fetch("http://localhost:3333/api/1.0.0/user", {
          method: 'post',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state)
      })
      .then((response) => {
        console.log(response.status)
        //Error handling
        if(response.status == 201){
          alert("Account Created");
          this.props.navigation.navigate("Login");
          return response.json()
        }else if(response.status == 400){
          alert("Bad Request\nPlease Check Your Input and Try Again")
        }else if(response.status == 401){
            alert("Unauthorised to Create Account\nPlease Try Again Later")
        }else if(response.status == 403){
            alert("Forbidden to Create Account\nPlease Try Again Later")
        }else if(response.status == 404){
            alert("Not Found\nPlease Try Again Later")
        }else if(response.status == 500){
          alert("A Server Error Has Occurred, Please Try Again Later");
        }else{
            throw "Uncought Error Occured";
        }
      })
      .then((responseJson) => {
          console.log("User created with ID: ", responseJson);
      })
      .catch((error) => {
          console.log(error);
      })
    }

    //Signup text input fields, updates state on key change
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
