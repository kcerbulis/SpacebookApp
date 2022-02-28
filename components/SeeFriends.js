import React, { Component } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SeeFriends extends Component{
    constructor(props){
        super(props);

        this.state = {
          isLoading: true,
          friendData: []
        }


    }



    componentDidMount() {
      console.log("Dwdw")
      this.loadFriends();
    }


    loadFriends = async () => {

      //Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      //Gets user ID
      const id = await AsyncStorage.getItem('@session_id');

      return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
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
              friendData: responseJson
            })
          })
          .catch((error) => {
              console.log(error);
          })

    }








    render(){
        return (
            <ScrollView>


                <View>
                  <FlatList
                    data={this.state.friendData}
                    renderItem={({item}) => (
                        <View>
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                    )}
                      />
                </View>





                <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
        )
    }
}

export default SeeFriends;
