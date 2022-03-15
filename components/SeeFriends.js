import React, { Component } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SeeFriends extends Component{
    constructor(props){
        super(props);

        //Stores information about user friend data
        this.state = {
          isLoading: true,
          friendData: []
        }
    }

    //Load friends when page is loaded
    componentDidMount() {
      this.loadFriends();
    }

    //Loads friend list for user, passes information to state
    loadFriends = async () => {
      //Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      //Gets user ID
      const id = await AsyncStorage.getItem('@session_id');
      //Queries server for friends
      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
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
                alert("Forbidden\nCan Only View the Friends of Yourself or Your Friends");
                this.props.navigation.goBack();
            }else if(response.status == 404){
                alert("Friends Not Found\nPlease Try Again Later")
                this.props.navigation.goBack();
            }else if(response.status == 500){
              alert("A Server Error Has Occurred, Please Try Again Later");
              this.props.navigation.goBack();
            }else{
                throw "Uncought Error Occured";
            }
          })
          .then((responseJson) => {
            //Passes result into state, stops loading view
            this.setState({
              isLoading: false,
              friendData: responseJson
            })
          })
          .catch((error) => {
              console.log(error);
          })
    }

    //If loading state is true, show loading screen
    //Displays first and last names for all friends of a given user
    render(){
      if(this.state.isLoading){
        return(
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
            <Text>Loading</Text>
          </View>
        );
      }else{
        return (
            <ScrollView>
                <View>
                  <FlatList data={this.state.friendData} renderItem={({item}) => (
                        <View>
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                    )} keyExtractor={(item,index) => item.user_id.toString()}/>
                </View>
                <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
        )
      }
    }
}

export default SeeFriends;
