import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequests extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      friendRequestData: []
    }
  }

  componentDidMount() {
    console.log("DELETE ME")
    this.loadFriendRequests();
  }


  loadFriendRequests = async () => {

    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
            friendRequestData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
        console.log("Reloading friend request")
  }












  acceptFriendRequest = async (requestingUserID) => {

    this.state.isLoading = true;

    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + requestingUserID, {
          method: 'post',
          headers: {
              'Content-Type': 'application/json',
              'X-Authorization':  value
          }
      })
      .then((response) => {
          //Reloads friend request list
          this.loadFriendRequests()
          if(response.status === 201){
              return response.json()
          }else if(response.status === 400){
              throw 'Failed validation';
          }else{
              throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
        console.log(responseJson)
      })
      .catch((error) => {
          console.log(error);
      })
  }









  declineFriendReques = async (requestingUserID) => {

    this.state.isLoading = true;

    console.log("Friend Request for user " + requestingUserID + " Declined")

    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + requestingUserID, {
          method: 'delete',
          headers: {
              'Content-Type': 'application/json',
              'X-Authorization':  value
          }
      })
      .then((response) => {
          //Reloads friend request list
          this.loadFriendRequests()
          if(response.status === 201){
              return response.json()
          }else if(response.status === 400){
              throw 'Failed validation';
          }else{
              throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
             this.loadFriendRequests();
             this.setState({
               isLoading: false,
             })

      })
      .catch((error) => {
          console.log(error);
      })
  }

  render() {

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
          <FlatList
            data={this.state.friendRequestData}
            renderItem={({item, index}) => (
                <View>
                  <Text>{item.first_name} {item.last_name}</Text>
                  <Button onPress={() => this.acceptFriendRequest(item.user_id)} title="Accept"/>
                  <Button onPress={() => this.declineFriendReques(item.user_id)} title="Decline"/>
                </View>
            )}/>
          <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
});

export default FriendRequests
