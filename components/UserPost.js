import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserPost extends Component{
    constructor(props){
        super(props);

        //Stores information about user post and loading state
        this.state = {
            isLoading: true,
            postData: [],
            request: {},
            updatePostContent: "",
            myPost: false
        }
    }
    //Loads user post when page is loaded
    componentDidMount() {
      this.loadPost();
    }

    //Loads user posts
    loadPost = async () => {
      //Gets token, post and user IDs
      const userPostID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');
      //Get post server request
      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + userPostID, {
            'headers': {
              'X-Authorization':  value
            }
          })
          .then((response) => {
            console.log(response.status)
            //Error handling
            if(response.status == 200){
              return response.json()
            }else if(response.status == 400){
              alert("Bad Request\nPlease Try Again")
              this.props.navigation.goBack();
            }else if(response.status == 401){
                alert("Unauthorised\nPlease Try Again Later")
                this.props.navigation.navigate("Login");
            }else if(response.status == 403){
                alert("Forbidden\nYou Can Only View the Posts of Yourself or Your Friends");
                this.props.navigation.goBack();
            }else if(response.status == 404){
                alert("Post Not Found\nPlease Try Again Later")
                this.props.navigation.goBack();
            }else if(response.status == 500){
              alert("A Server Error Has Occurred, Please Try Again Later");
              this.props.navigation.goBack();
            }else{
                throw "Uncought Error Occured";
            }
          })
          .then((responseJson) => {
            //Stops loading view and passes response to state for display
            this.setState({
              isLoading: false,
              postData: responseJson
            })
            //Checks whos post it is, updates state
            this.checkAuthor();
          })
          .catch((error) => {
              console.log(error);
          })
    }

    //Updates post, saves response in state
    updatePost = async (requestingUserID) => {
      //Checks if any content to update
      if (Object.keys(this.state.updatePostContent).length == 0) {
        alert("Nothing to update")
      }
      else{
        //Retrieves token, post and user ID
        const postID = await AsyncStorage.getItem('@post_id');
        const userID = await AsyncStorage.getItem('@user_id');
        const value = await AsyncStorage.getItem('@session_token');
        //Sets update text state to originas post state
        this.state.postData.text = this.state.updatePostContent
        //Sets state as request body
        const body = this.state.postData

        //Update post server request
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
            //Error handling
            if(response.status == 200){
              alert("Post Updated")
              this.props.navigation.goBack();
              return response.json()
            }else if(response.status == 400){
              alert("Bad Request\nPlease Try Again")
              this.props.navigation.goBack();
            }else if(response.status == 401){
                alert("Unauthorised\nPlease Try Again Later")
                this.props.navigation.navigate("Login");
            }else if(response.status == 403){
                alert("Forbidden\nYou Can Only Update Your Own Posts");
                this.props.navigation.goBack();
            }else if(response.status == 404){
                alert("Post Not Found\nPlease Try Again Later")
                this.props.navigation.goBack();
            }else if(response.status == 500){
              alert("A Server Error Has Occurred, Please Try Again Later");
              this.props.navigation.goBack();
            }else{
                throw "Uncought Error Occured";
            }
      })
      .catch((error) => {
          console.log(error);
      })
      }
    }

    //Likes an individual post
    likePost = async () => {
      //Gets token, post and user IDs
      const userPostID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');
      //Like post server request
      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + userPostID + "/like", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
          console.log(response.status)
          //Error handling
          if(response.status == 200){
  	        alert("Post Liked");
            this.props.navigation.goBack();
            return response.json();
          }else if(response.status == 400){
            alert("Bad Request\nPlease Try Again")
          }else if(response.status == 401){
              alert("Unauthorised\nPlease Try Again Later")
              this.props.navigation.navigate("Login");
          }else if(response.status == 403){
              alert("Forbidden\nPost Already Liked or Post Not Made by Your Friend\n*POTENTIAL KNOWN SERVER ERROR*")
              this.props.navigation.goBack();
          }else if(response.status == 404){
              alert("Post Not Found\nPlease Try Again Later")
              this.props.navigation.goBack();
          }else if(response.status == 500){
            alert("A Server Error Has Occurred, Please Try Again Later");
            this.props.navigation.goBack();
          }else{
              throw "Uncought Error Occured";
          }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    //Unlike an individual post
    unlikePost = async () => {
      //Gets token, post and user IDs
      const userPostID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@user_id');
      const value = await AsyncStorage.getItem('@session_token');

      //Unlike post server request
      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + userPostID + "/like", {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
          //Error handling
          console.log(response.status)
          if(response.status == 200){
  	        alert("Like Removed");
            this.props.navigation.goBack();
            return response.json();
          }else if(response.status == 400){
            alert("Bad Request\nPlease Try Again");
          }else if(response.status == 401){
              alert("Unauthorised\nPlease Try Again Later");
              this.props.navigation.navigate("Login");
          }else if(response.status == 403){
            alert("Forbidden\nPost Not Liked or Post Not Made by Your Friend\n*POTENTIAL KNOWN SERVER ERROR*")
            this.props.navigation.goBack();
          }else if(response.status == 404){
              alert("Post Not Found\nPlease Try Again Later");
              this.props.navigation.goBack();
          }else if(response.status == 500){
            alert("A Server Error Has Occurred, Please Try Again Later");
            this.props.navigation.goBack();
          }else{
              throw "Uncought Error Occured";
          }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    //Deletes specific post
    deletePost = async () => {
      //Loading view
      this.state.isLoading = true;
      //Gets token, post and user IDs
      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@userT_id');
      const value = await AsyncStorage.getItem('@session_token');
      //Delete post server request
      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postID, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            }
        })
        .then((response) => {
          if(response.status == 200){
  	         alert("Post Removed")
             this.props.navigation.goBack();
             return response.json()
          }else if(response.status == 400){
             alert("Bad Request\nPlease Try Again")
          }else if(response.status == 401){
              alert("Unauthorised\nPlease Try Again Later")
              this.props.navigation.navigate("Login");
          }else if(response.status == 403){
              alert("Forbidden\nYou Can Only Delete Your Own Posts")
              this.props.navigation.goBack();
          }else if(response.status == 404){
              alert("Post Not Found\nPlease Try Again Later")
              this.props.navigation.goBack();
          }else if(response.status == 500){
            alert("A Server Error Has Occurred, Please Try Again Later");
            this.props.navigation.goBack();
          }else{
              throw "Uncought Error Occured";
          }
        })
        .then((responseJson) => {
          //Loading view disabled
          this.state.isLoading = false;
        })
        .catch((error) => {
            console.log(error);
        })
    }

    //Checks author of post, passes it to state
    checkAuthor = async () => {
      //Gets session ID
      const myID = await AsyncStorage.getItem('@session_id');
      //Compares post ID with session ID, update state accordingly
      if(this.state.postData.author.user_id == myID){
        this.setState({
          myPost: true
        });
      }
    }

    //If loading state is true, show loading screen
    //Changes functionality depending on if user is author of post
    render(){
      if(this.state.isLoading){
        return(
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
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
                <TextInput defaultValue={this.state.postData.text} onChangeText={value => this.setState({updatePostContent: value})}/>
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
