import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserPost extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            postData: [],
            request: {},
            updatePostContent: "",
            myPost: false
        }
    }




    componentDidMount() {
      this.loadPost();
    }



    updatePost = async (requestingUserID) => {


      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');

      console.log("The post ID is " + postID)
      console.log("The user ID is " + userID)
      console.log("The session token is " + value)

      this.state.postData.text = this.state.updatePostContent

      const body = this.state.postData




      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization':  value
        },
        body: JSON.stringify(body)
    })
    .then((response) => {
        console.log(response.status)
        this.props.navigation.goBack();
        alert("Post Updated")
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








    checkAuthor = async () => {
      console.log("Author checked")

      const dddd = await this.state.postData.user_id

      console.log(dddd)
    }




    likePost = async () => {

      const userPostID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');





      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + userPostID + "/like", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
          console.log(response.status)
          this.props.navigation.goBack()
            if(response.status === 201){
                console.log("Yay")
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {

        })
        .catch((error) => {
            console.log(error);
        })
    }


    unlikePost = async () => {
      console.log("Post unliked");


      const userPostID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');





      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + userPostID + "/like", {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
          console.log(response.status)
          this.props.navigation.goBack()
            if(response.status === 201){
                console.log("Yay")
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {


        })
        .catch((error) => {
            console.log(error);
        })
    }














    //Loads user posts
    loadPost = async () => {

      const userPostID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');

      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + userPostID, {
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
            this.checkAuthor();
          })
          .catch((error) => {
              console.log(error);
          })
    }



















    deletePost = async () => {


      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@userT_id');
      const value = await AsyncStorage.getItem('@session_token');

      console.log(postID)
      console.log(userID)
      console.log(value)

      let string = "http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID;

      return fetch(string, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
            console.log(string + " : " + response.status)
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



    checkAuthor = async () => {

      const myID = await AsyncStorage.getItem('@session_id');

      if(this.state.postData.author.user_id == myID){
        this.setState({
          myPost: true
        });
      }
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
        if(this.state.myPost == false){
          return (
            <ScrollView>
              <View>


              <Text>
                {this.state.postData.text}
              </Text>


              </View>
              <Button title="Like" onPress={() => this.likePost()}/>
              <Button title="Unlike" onPress={() => this.unlikePost()}/>
              <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
            );
          }
        else if (this.state.myPost == true) {
          return(
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
            </ScrollView>
          );
        }
      }
    }
  }


export default UserPost;
