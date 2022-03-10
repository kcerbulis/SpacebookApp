import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Posts extends Component{
    constructor(props){
        super(props);


        this.state = {
          isLoading: true,
          postData: [],
          postContent: "",
          postsState: ''
        }
    }

    componentDidMount() {

      this.checkWhosPosts();

      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.loadPosts();
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
                              onPress={() => this.inspecPost(item.post_id)}
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
            <Text>wwwww</Text>
          )
        }



      }
    }

}

export default Posts;
