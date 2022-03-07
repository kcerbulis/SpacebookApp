import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserPosts extends Component{
    constructor(props){
        super(props);


        this.state = {
          isLoading: true,
          postData: [],
          postContent: ""
        }
    }

    componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.loadPosts();
      });
    }

    componentWillUnmount() {
      AsyncStorage.removeItem('post_id');
    }


    //Loads user posts
    loadPosts = async () => {


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
              listData: responseJson
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
      const id = await AsyncStorage.getItem('@user_id');



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




    inspecPost = async (postID, profileID) => {

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
      }else{

        return (
          <ScrollView>
            <View>

              <TextInput
                placeholder='Type a new post here...'
                onChangeText={value => this.setState({postContent: value})}
                value={this.state.postContent}
              />




              <Button
                onPress={() => {
                  this.uploadNewPost();
                }}
                title="Add new post"
              />

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
                )}
                  />





            </View>
            <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
          </ScrollView>
        );
      }
    }
}

export default UserPosts;
