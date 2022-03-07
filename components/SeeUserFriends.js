import React, { Component } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SeeUserFriends extends Component{
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
      const id = await AsyncStorage.getItem('@user_id');

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
              }else if(response.status === 403){
                alert("Can only view the friends of yourself or your friends")
                this.props.navigation.goBack();
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
                  <FlatList
                    data={this.state.friendData}
                    renderItem={({item}) => (
                        <View>
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                      />
                </View>





                <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
        )
      }
    }
}

export default SeeUserFriends;