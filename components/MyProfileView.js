import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, Button, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



class MyProfileView extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }




  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search", {
          'headers': {
            'X-Authorization':  value
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }













  render() {
    return (
      <ScrollView>

























        <Button
            title="My Post"
            onPress={() => this.props.navigation.navigate("MyPosts")}
        />


        <Button
            title="Friend Request"
            onPress={() => this.props.navigation.navigate("FriendRequests")}
        />

        <Button
            title="Friend List"
            onPress={() => this.props.navigation.navigate("SeeFriends")}
        />


        <Button
            title="My Info"
            onPress={() => this.props.navigation.navigate("UpdateMyInfo")}
        />







      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
});

export default MyProfileView
