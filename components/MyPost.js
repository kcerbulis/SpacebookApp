import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MyPost extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            postData: [],
            request: {},
            updatePostContent: ""
        }
    }

    updatePost = async () => {
      //Accessing tokens and ID's for PATCH request
      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@session_id');
      const value = await AsyncStorage.getItem('@session_token');

      //Updates text entry for post in state
      this.state.postData.text = this.state.updatePostContent;
      //Turns request body in JSON string
      const body = JSON.stringify(this.state.postData)

      console.log("Request body: " + body)

      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID, {
            method: 'patch',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value,
                'mode': 'no-cors'
            },
            body: body
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          alert("Entry updated")
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
      this.loadPost();
    }


    //Loads user posts
    loadPost = async () => {

      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@session_id');
      const value = await AsyncStorage.getItem('@session_token');

      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID, {
            'headers': {
              'X-Authorization':  value
            }
          })
          .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 401){
                alert("You need to log in")
                this.props.navigation.navigate("Login");
              }else if(response.status === 404){
                alert("This post no longer exists")
                this.props.navigation.goBack();
              }else{
                  throw 'Something went wrong';
              }
          })
          .then((responseJson) => {
            console.log(responseJson)
            this.setState({
              isLoading: false,
              postData: responseJson
            })
          })
          .catch((error) => {
              console.log(error);
          })

    }



















    deletePost = async (requestingUserID) => {

      this.state.isLoading = true;

      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@session_id');
      const value = await AsyncStorage.getItem('@session_token');

      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
            console.log(response.status)
            this.props.navigation.goBack();
            alert("Post Removed")
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong ' + response.status;
            }
        })
        .then((responseJson) => {
          console.log("Need to go back")
        })
        .catch((error) => {
            console.log(error);
        })
    }




































    render(){
      if(this.state.isLoading){
        return(
          <View
            style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text>Loading</Text>
          </View>
        );
      }else{

        return (
          <ScrollView>
            <View>

            <TextInput
              defaultValue={this.state.postData.text}
              onChangeText={value => this.setState({updatePostContent: value})}
            />


            </View>
            <Button title="Update" onPress={() => this.updatePost()}/>
            <Button title="Delete" onPress={() => this.deletePost()}/>
            <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            <Button title="patch" onPress={() => this.perfectExample()}/>
          </ScrollView>
        );
      }
      }
    }


export default MyPost;
