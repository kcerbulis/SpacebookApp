import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchStack extends Component {
  constructor(props){
    super(props);


    this.state = {
      isLoading: true,
      searchText: '',
      userData: []
    }
  }

  componentDidMount() {
    this.loadUsers();
  }







  navigateToProfile = async (userID) => {


    await AsyncStorage.setItem('@user_id', userID);
    await AsyncStorage.setItem('@userT_id', userID);

    const test = await AsyncStorage.getItem('@user_id');


    console.log("Navigating to user " + test)


    this.props.navigation.navigate("UserProfileView")
  }
















  queryUsers = async () => {


    let queryText = this.state.searchText;

    console.log(queryText)

    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/search?q=" + queryText, {
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



  loadUsers = async () => {

    //Gets user session token
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


        <TextInput
          placeholder='Search user by name...'
          onChangeText={value => this.setState({searchText: value})}
          value={this.state.searchText}
        />

        <Button title="Search" onPress={() => this.queryUsers()}/>


        <View>
          <FlatList
            data={this.state.friendData}
            renderItem={({item}) => (
                <View>
                  <Text>{item.user_givenname} {item.user_familyname}</Text>

                  <Button
                    onPress={() => this.navigateToProfile(item.user_id)}
                    title="View Profile"
                  />
                </View>
            )}
            keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>





        <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
      </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
});

export default SearchStack
