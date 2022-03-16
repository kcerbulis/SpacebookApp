import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet, FlatList, Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequests extends Component {
  constructor(props) {
    super(props);

    // Stores information on friend requests
    this.state = {
      requestsPending: false,
      isLoading: true,
      friendRequestData: [],
    };
  }

  // Loads friend requests when page focus changes
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadFriendRequests();
    });
  }

  // Retrieves friend requests from server
  loadFriendRequests = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Server friend request request
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
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
          alert('Bad Request\nPlease Try Again');
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nPlease Try Again Later');
        } else if (response.status == 404) {
          alert('Not Found\nPlease Try Again Later');
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendRequestData: responseJson,
        });
        // If friend requests present
        if (this.state.friendRequestData.length > 0) {
          this.setState({
            requestsPending: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  acceptFriendRequest = async (requestingUserID) => {
    // Shows loading indicator
    this.state.isLoading = true;
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Server request to accept friendship request
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${requestingUserID}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        // Error handling
        console.log(response.status);
        if (response.status == 200) {
          alert('Friend Added');
          this.loadFriendRequests();
          return response.json();
        } if (response.status == 400) {
          alert('Bad Request\nPlease Try Again');
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nPlease Try Again Later');
        } else if (response.status == 404) {
          alert('Not Found\nPlease Try Again Later');
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .then((responseJson) => {
        // Stops loading indicator, reloads request list
        this.setState({
          isLoading: false,
        });
        this.loadFriendRequests();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  declineFriendReques = async (requestingUserID) => {
    // Shows loading indicator
    this.state.isLoading = true;
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Server request to decline friendship request
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${requestingUserID}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        this.loadFriendRequests();
        // Error handling
        if (response.status == 200) {
	          alert('Friend Request Declined');
          return response.json();
        } if (response.status == 400) {
          alert('Bad Request\nPlease Try Again');
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nPlease Try Again Later');
        } else if (response.status == 404) {
          alert('Not Found\nPlease Try Again Later');
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .then((responseJson) => {
        // Stops loading indicator, reloads request list
        this.setState({
          isLoading: false,
        });
        this.loadFriendRequests();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // If friend requests are present, display buttons to accept or deline it
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{
          flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}
        >
          <Text>Loading</Text>
        </View>
      );
    } if (this.state.requestsPending == false) {
      return (
        <ScrollView>
          <Text>No Pending Friend Requests</Text>
          <Button title="Go Back" onPress={() => this.props.navigation.goBack()} />
        </ScrollView>
      );
    }
    return (
      <ScrollView>
        <FlatList
          data={this.state.friendRequestData}
          renderItem={({ item, index }) => (
            <View>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <Button onPress={() => this.acceptFriendRequest(item.user_id)} title="Accept" />
              <Button onPress={() => this.declineFriendReques(item.user_id)} title="Decline" />
            </View>
          )}
        />
        <Button title="Go Back" onPress={() => this.props.navigation.goBack()} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
});

export default FriendRequests;
