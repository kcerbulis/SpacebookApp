import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { Button} from 'reactstrap';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    // Stores user information and loading state
    this.state = {
      isLoading: true,
      userInfo: [],
    };
  }

  // Loads user information when page loads
  componentDidMount() {
    this.loadPosts();
  }

  // Retrieves user information and passes to state
  loadPosts = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Gets user ID
    const id = await AsyncStorage.getItem('@user_id');
    // Get user information server request
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
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
          this.props.navigation.goBack();
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nCan’t See This Users Information ');
          this.props.navigation.goBack();
        } else if (response.status == 404) {
          alert('User Information Not Found\nPlease Try Again Later');
          this.props.navigation.goBack();
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
          this.props.navigation.goBack();
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .then((responseJson) => {
        // Passes result into state, stops loading view
        this.setState({
          isLoading: false,
          userInfo: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // If loading state is true, show loading screen
  // User information displayed as simple text fields since can't be edited in this view
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
    }
    return (
      <View style={styles.container}>
        <ScrollView  style={styles.conent} showsVerticalScrollIndicator={false}>
          <View style={styles.userInfo}>
            <Text  style={styles.text}>
              {this.state.userInfo.first_name}
            </Text>
            <Text  style={styles.text}>
              {this.state.userInfo.last_name}
            </Text>
            <Text  style={styles.text}>
              {this.state.userInfo.email}
            </Text>
          </View>
          <Button color="primary" outline onClick={() => this.props.navigation.goBack()}>Back</Button>
        </ScrollView>
      </View>
    );
  }
}

// Styling
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: 'center',
    backgroundColor: "#e5f6ff"
  },

  conent: {
    marginTop: "1%",
  },

  userInfo: {
    marginBottom: "7%",
  },

  text: {
    fontWeight: 500,
  },

});

export default UserInfo;
