import React, { Component } from 'react';
import { Button } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        //Saves typed login credentials to state reference
        this.state = {
            email: "",
            password: ""
        }
    }




    login = async () => {


        //Login POST request
        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })




        //Checks what status is returned for login credentials \
        .then((response) => {
            // 200 = OK
            if(response.status === 200){
                return response.json()
            //400 = Bad Request
            }else if(response.status === 400){
                alert("Email or Username Invalid!\nPlease Create an Account if You Don't Have One")
                throw 'Invalid email or password';
            //401 = Unauthorized
            }else if(response.status === 401){
                alert("Invalid Authentication Credentials!")
                throw "Invalid Authentication Credentials!";
            }
            else{
                alert("An Issue Has Occurred, Please Try Again")
                throw 'Something went wrong';
            }
        })






        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);

                this.props.navigation.navigate("Main");
        })







        .catch((error) => {
            console.log(error);
        })
    }













    render(){
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Login"
                    onPress={() => this.login()}
                />
                <Button
                    title="Create an account"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Signup")}
                />
            </ScrollView>
        )
    }
}

export default LoginScreen;
