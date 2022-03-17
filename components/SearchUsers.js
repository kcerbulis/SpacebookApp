import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchUsers extends Component {
  constructor(props) {
    super(props);

    // Stores data about users and querying user results
    this.state = {
      isLoading: true,
      searchText: '',
      userData: [],
      peopleOffset: 0,
      noNext: false,
      searchByName: false
    };
  }

  componentDidMount() {
    // Updates list everytime focus is changed
    //this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // this.setState({
      //   peopleOffset: 0,
      // });
      this.loadUsers();
    //});
  }

  // Navigates to appropriate user profile
  navigateToProfile = async (userID) => {
    //Saves user_id to state
    await AsyncStorage.setItem('@user_id', userID);

    const me = await AsyncStorage.getItem('@session_id');

    console.log("User id is " + userID)
    console.log("My id is " + me)



    if(userID == me){
        await AsyncStorage.setItem('@profileState', 'mineSearch');
    }
    else{
        await AsyncStorage.setItem('@profileState', 'user');
    }


    // Navigates to profile
    this.props.navigation.navigate('Profile');
  }

  // Returns a list of all users, passed into state
  loadUsers = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    //Amount of people visible per page
    const userPerPageLimit = 6;
    //Amount of people already seen
    let peopleOffset = this.state.peopleOffset;



    // User list server request
    return fetch('http://localhost:3333/api/1.0.0/search?limit=' + userPerPageLimit + "&offset=" + peopleOffset, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        // Error handling
        if (response.status == 200) {
          return response.json();
        } if (response.status == 400) {
          alert('Bad Request\nPlease Try Again Later');
          this.props.navigation.goBack();
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Log In');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nYou Can’t See All Users');
          this.props.navigation.goBack();
        } else if (response.status == 404) {
          alert('Users Not Found\nPlease Try Again Later');
          this.props.navigation.goBack();
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
          this.props.navigation.goBack();
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .then((responseJson) => {
        if(responseJson.length < 6){
          this.state.noNext = true;
        }
        // Passes response to state, stops loading view
        this.setState({
          isLoading: false,
          friendData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Searches list of all users, passes results to state
  queryUsers = async () => {
    //Checks if search field is empty
    if(this.state.searchText == ''){
      alert("Nothing In Search")
    }
    else{
      this.setState({
        searchByName: true,
      });
      // Creates query string variable
      const queryText = this.state.searchText;
      // Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      // Query users server request
      return fetch(`http://localhost:3333/api/1.0.0/search?q=${queryText}`, {
        headers: {
          'X-Authorization': value,
        },
      })
        .then((response) => {
          console.log(response.status);
          // Error handling
          if (response.status == 200) {
            return response.json();
          } if (response.status == 400) {
            alert('Bad Request\nPlease Try Again Later');
          } else if (response.status == 401) {
            alert('Unauthorised\nPlease Log In');
            this.props.navigation.navigate('Login');
          } else if (response.status == 403) {
            alert('Forbidden\nYou Can’t Search Users');
            this.props.navigation.goBack();
          } else if (response.status == 404) {
            alert('User/s Not Found\nPlease Try Again');
          } else if (response.status == 500) {
            alert('A Server Error Has Occurred, Please Try Again Later');
          } else {
            throw 'Uncought Error Occured';
          }
        })
        .then((responseJson) => {
        // Passes response to state, stops loading view
          this.setState({
            isLoading: false,
            searchText: '',
            friendData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  nextPage = async () => {
    //Increments people offset
    let newPeopleOffset = this.state.peopleOffset + 6;
    //Sets new state
    await this.setState({
      peopleOffset: newPeopleOffset,
    });
    //Reloads list with new offset
    this.loadUsers();
  }

  previousPage = async () => {
    //Reduces people offset
    let newPeopleOffset = this.state.peopleOffset - 6;
    //Sets new state
    await this.setState({
      peopleOffset: newPeopleOffset,
    });
    //Reloads list with new offset
    this.loadUsers();
  }

  resetSearch = async () => {
    this.setState({
      searchText: '',
      peopleOffset: 0,
      searchByName: false
    });
    this.loadUsers();
  }



  // If loading state is true, show loading screen
  // Allows to veiw, search and inspect all other users profiles
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading</Text>
        </View>
      );
    }if(this.state.searchByName){
      return(
        <ScrollView>
          <TextInput placeholder="Search user by name..." onChangeText={(value) => this.setState({ searchText: value })} value={this.state.searchText} />
          <Button title="Search" onPress={() => this.queryUsers()} />
          <View>
            <FlatList
              initialNumToRender={10}
              windowSize={10}
              data={this.state.friendData}
              renderItem={({ item }) => (
                <View>
                  <Text>
                    {item.user_givenname}
                    {' '}
                    {item.user_familyname}
                  </Text>
                  <Button onPress={() => this.navigateToProfile(item.user_id)} title="View Profile" />
                </View>
              )}
              keyExtractor={(item, index) => item.user_id.toString()}
            />
          </View>
          <Button title="Reset Search" onPress={() => this.resetSearch()} />
        </ScrollView>
      )
    }
    if(this.state.peopleOffset == 0){
      return(
        <ScrollView>
          <TextInput placeholder="Search user by name..." onChangeText={(value) => this.setState({ searchText: value })} value={this.state.searchText} />
          <Button title="Search" onPress={() => this.queryUsers()} />
          <View>
            <FlatList
              initialNumToRender={10}
              windowSize={10}
              data={this.state.friendData}
              renderItem={({ item }) => (
                <View>
                  <Text>
                    {item.user_givenname}
                    {' '}
                    {item.user_familyname}
                  </Text>
                  <Button onPress={() => this.navigateToProfile(item.user_id)} title="View Profile" />
                </View>
              )}
              keyExtractor={(item, index) => item.user_id.toString()}
            />
          </View>
          <Button title="Next" onPress={() => this.nextPage()} />
        </ScrollView>
      )
    }
    else{
      if(this.state.noNext){
        return (
          <ScrollView>
            <TextInput placeholder="Search user by name..." onChangeText={(value) => this.setState({ searchText: value })} value={this.state.searchText} />
            <Button title="Search" onPress={() => this.queryUsers()} />
            <View>
              <FlatList
                initialNumToRender={10}
                windowSize={10}
                data={this.state.friendData}
                renderItem={({ item }) => (
                  <View>
                    <Text>
                      {item.user_givenname}
                      {' '}
                      {item.user_familyname}
                    </Text>
                    <Button onPress={() => this.navigateToProfile(item.user_id)} title="View Profile" />
                  </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
              />
            </View>
            <Button title="Back" onPress={() => this.previousPage()} />
          </ScrollView>
        );
      }
      else{
        return (
          <ScrollView>
            <TextInput placeholder="Search user by name..." onChangeText={(value) => this.setState({ searchText: value })} value={this.state.searchText} />
            <Button title="Search" onPress={() => this.queryUsers()} />
            <View>
              <FlatList
                initialNumToRender={10}
                windowSize={10}
                data={this.state.friendData}
                renderItem={({ item }) => (
                  <View>
                    <Text>
                      {item.user_givenname}
                      {' '}
                      {item.user_familyname}
                    </Text>
                    <Button onPress={() => this.navigateToProfile(item.user_id)} title="View Profile" />
                  </View>
                )}
                keyExtractor={(item, index) => item.user_id.toString()}
              />
            </View>
            <Button title="Back" onPress={() => this.previousPage()} />
            <Button title="Next" onPress={() => this.nextPage()} />
          </ScrollView>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
});

export default SearchUsers;
