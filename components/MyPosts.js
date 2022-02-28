import React, { Component } from 'react';
import { Button, Text, FlatList, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MyPosts extends Component{
    constructor(props){
        super(props);


        this.state = {
          isLoading: true,
          postData: [],
          postContent: ""
        }
    }

    componentDidMount() {
      this.loadPosts();
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

              <FlatList
                  data={this.state.listData}
                  renderItem={({item}) => (
                      <View>
                        <Text>{item.text}</Text>
                      </View>
                )}
                  />



              <Button
                onPress={() => {
                  this.uploadNewPost();
                }}
                title="Add new post"
              />

            </View>
            <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
          </ScrollView>
        );
      }
    }
}

export default MyPosts;
