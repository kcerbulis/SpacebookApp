import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Posts extends Component{
    constructor(props){
        super(props);

        this.state = {
          isLoading: false,
          postData: [],
          postContent: "",
          userPostContent: "",
          postsState: ''
        }
    }

    async componentDidMount() {

      let postsState = await AsyncStorage.getItem('@postsState');




      this.unsubscribe = this.props.navigation.addListener('focus', () => {

        this.checkWhosPosts();

        if(postsState == 'mine'){
          this.loadPosts();
        }
        else if (postsState == 'user'){
          this.loadPostsUser();
        }




      });
    }

    checkWhosPosts = async () => {

      //Stores who's profile needs to be displayed
      let postsState = await AsyncStorage.getItem('@postsState');

      //Sets state of whos profile looking at
      await this.setState({
        postsState: postsState
      })
      //If profile not mine, checks if user is my friend and display profile photo
      if(postsState == 'user'){
        console.log("Looking at NOT my posts");
      }
      else(
        console.log("Looking at MY posts")
      )

      console.log("The async state is " + postsState)
      console.log("The page state is " + this.state.postsState)

    }


    //Loads user posts
    loadPosts = async () => {

      console.log("Loading posts for ME")

      this.setState({
        isLoading: true,
      })


      //Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      //Gets user ID
      const id = await AsyncStorage.getItem('@session_id');

      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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
              }else{
                  throw 'Something went wrong';
              }
          })
          .then((responseJson) => {
            console.log(responseJson)
            this.setState({
              isLoading: false,
              listData: responseJson
            })
          })
          .catch((error) => {
              console.log(error);
          })
    }

    //Loads user posts
    loadPostsUser = async () => {


      console.log("Loading posts for USER")

      this.setState({
        isLoading: true,
      })


      //Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      //Gets user ID
      const id = await AsyncStorage.getItem('@user_id');

      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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
              }else if(response.status === 403){
                alert("You can only see post of your friends")
                this.props.navigation.goBack();
              }else{
                  throw 'Something went wrong';
              }
          })
          .then((responseJson) => {
            console.log(responseJson)
            this.setState({
              isLoading: false,
              listDataUser: responseJson
            })
          })
          .catch((error) => {
              console.log(error);
          })
    }

    uploadNewPost = async () => {

      //Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      //Gets user ID
      const id = await AsyncStorage.getItem('@session_id');



      let postContentVar = {
        text: this.state.postContent
      }



      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            },
            body: JSON.stringify(postContentVar)
        })
        .then((response) => {
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
               console.log("This should work");
               this.state.postContent = "";
               this.loadPosts();

        })
        .catch((error) => {
            console.log(error);
            this.loadPosts();
        })
    }

    uploadNewPostUser = async () => {

      //Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      //Gets user ID
      const id = await AsyncStorage.getItem('@user_id');



      let postContentVar = {
        text: this.state.userPostContent
      }

      console.log(postContentVar)



      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization':  value
            },
            body: JSON.stringify(postContentVar)
        })
        .then((response) => {
            console.log("Response " + response.status)
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("This should work");
               this.state.userPostContent = "";
               this.loadPostsUser();

        })
        .catch((error) => {
            console.log(error);
        })
    }

    inspecPost = async (postID, userID) => {

      await AsyncStorage.setItem('@post_id', postID);
      const iddd = await AsyncStorage.getItem('@post_id');


      console.log(postID)
      console.log(userID)

      this.props.navigation.navigate("MyPost")

    }

    inspecPostUser = async (postID, profileID) => {

      await AsyncStorage.setItem('@post_id', postID);
      const userPostID = await AsyncStorage.getItem('@post_id');

      await AsyncStorage.setItem('@profile_id', profileID);
      const posterProfileID = await AsyncStorage.getItem('@profile_id');


      console.log("Post ID is " + userPostID)

      console.log("User ID is " + posterProfileID)

      this.props.navigation.navigate("UserPost")

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
      }else if(this.state.isLoading == false){

        if(this.state.postsState == 'mine'){
          return(
            <ScrollView>
              <View>
                <TextInput placeholder='Type a new post here...' onChangeText={value => this.setState({postContent: value})} value={this.state.postContent}/>
                <Button onPress={() => {this.uploadNewPost();}} title="Add new post"/>
                <FlatList
                    data={this.state.listData}
                    renderItem={({item, index}) => (
                        <View>
                          <Text>{item.author.first_name}: {item.text} [{item.numLikes} likes]</Text>
                          <Button
                              title="Inspec Post"
                              onPress={() => this.inspecPost(item.post_id, item.author.user_id)}
                          />
                        </View>
                  )}/>
              </View>
              <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
          )
        }
        else{
          return(
            <ScrollView>
              <View>
                <TextInput placeholder='Type a new post here...' onChangeText={value => this.setState({userPostContent: value})} value={this.state.userPostContent}/>
                <Button onPress={() => {this.uploadNewPostUser();}} title="Add new post"/>
                <FlatList
                    data={this.state.listDataUser}
                    renderItem={({item, index}) => (
                        <View>
                          <Text>{item.author.first_name}: {item.text} [{item.numLikes} likes]</Text>
                          <Button title="Inspec Post" onPress={() => this.inspecPostUser(item.post_id, item.author.user_id)}/>
                        </View>
                    )}/>
              </View>
              <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
          )
        }



      }
    }

}

export default Posts;
