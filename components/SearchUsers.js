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
    };
  }

  componentDidMount() {
    // Updates list everytime focus is changed
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadUsers();
    });
  }

  // Navigates to appropriate user profile
  navigateToProfile = async (userID) => {
    // Sets async storage profileState to 'user' and save user ID
    await AsyncStorage.setItem('@user_id', userID);
    await AsyncStorage.setItem('@profileState', 'user');
    // Navigates to profile
    this.props.navigation.navigate('Profile');
  }

  // Returns a list of all users, passed into state
  loadUsers = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // User list server request
    return fetch('http://localhost:3333/api/1.0.0/search', {
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
          friendData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
    }
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
});

export default SearchUsers;
