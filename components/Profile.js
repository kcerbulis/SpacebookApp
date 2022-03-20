import React, { Component } from 'react';
import {
  Text, TextInput, View, ScrollView, StyleSheet, Alert, FlatList, Image,
} from 'react-native';
import { Button } from 'reactstrap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera } from 'expo-camera';

// Main class for displaying Profile content
class Profile extends Component {
  constructor(props) {
    super(props);

    // States used to store and display information
    this.state = {
      isLoading: true,
      photo: '',
      photoUser: '',
      profileState: '',
      listData: [],
      isFriend: false,
      myName: '',
      userName: '',
    };
  }

  componentDidMount() {
    // Checks if Mine or User profile
    this.checkWhosProfile();
    // Allows new profile photo and name to be seen immedietly after update
    this.focus = this.props.navigation.addListener('focus', () => {
      this.updateProfilePhoto();
      this.loadMyName();
    });
  }

  checkWhosProfile = async () => {
    // Stores who's profile needs to be displayed
    const profileState = await AsyncStorage.getItem('@profileState');
    // Sets state of whos profile looking at
    await this.setState({
      profileState,
    });
    // If profile not mine, checks if user is my friend and display profile photo
    if (profileState == 'user') {
      console.log('Looking at NOT my profile');
      this.checkIfFriend();
      this.displayProfilePhotoUser();
      this.loadUserName();
    }
  }

  // Displays full name in profile
  loadMyName = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Gets user ID
    const id = await AsyncStorage.getItem('@session_id');
    // User information server request
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        // Error handling
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          alert('Unauthorised! You need to log in!');
          this.props.navigation.navigate('Login');
        } else if (response.status === 403) {
          alert('Forbidden To See Profile Name');
        } else if (response.status === 404) {
          alert("Couldn't Find Profile Information!");
        } else if (response.status === 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          alert('An uncaught error has occored');
        }
      })
      .then((responseJson) => {
        // Sets name variable from response
        const myName = `${responseJson.first_name} ${responseJson.last_name}`;
        // Passes name into state
        this.setState({
          isLoading: false,
          myName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Displays full name in profile
  loadUserName = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Gets user ID
    const id = await AsyncStorage.getItem('@user_id');
    // User information server request
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        // Error handling
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          alert('Unauthorised! You need to log in!');
          this.props.navigation.navigate('Login');
        } else if (response.status === 403) {
          alert('Forbidden To See Profile Name');
        } else if (response.status === 404) {
          alert("Couldn't Find Profile Information!");
        } else if (response.status === 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          alert('An uncaught error has occored');
        }
      })
      .then((responseJson) => {
        // Sets name variable from response
        const userName = `${responseJson.first_name} ${responseJson.last_name}`;
        // Passes name into state
        this.setState({
          isLoading: false,
          userName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Checks if user is friend
  checkIfFriend = async () => {
    // Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    // Gets user ID
    const id = await AsyncStorage.getItem('@user_id');

    // Only returns without erro if friend, used as a check
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        // Simple error handling
        if (response.status === 403) {
          // NOT FRIEND = Update State
          this.setState({
            isFriend: false,
          });
        } else {
          (
          // FRIEND = Update State
            this.setState({
              isFriend: true,
            })
          );
        }
      });
  }

  // When a new profile picture is takes, updated picture shown
  updateProfilePhoto = async () => {
    this.displayProfilePhoto();
  }

  // Gets profile photo from server and passes into state for display
  displayProfilePhoto = async () => {
    // Gets my user ID
    const userID = await AsyncStorage.getItem('@session_id');
    // Gets my seesion token
    const value = await AsyncStorage.getItem('@session_token');

    // Gets photo from server
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/photo`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((res) =>
      // Formats result into blob
        res.blob())
      .then((resBlob) => {
      // Formats blob into object URL
        const data = URL.createObjectURL(resBlob);
        // Passes data to state for display
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  displayProfilePhotoUser = async () => {
    // Gets user ID
    const userID = await AsyncStorage.getItem('@user_id');
    // Gets my seesion token
    const value = await AsyncStorage.getItem('@session_token');

    // Gets user photo from server
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/photo`, {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((res) =>
      // Formats result into blob
        res.blob())
      .then((resBlob) => {
      // Formats blob into object URL
        const data = URL.createObjectURL(resBlob);
        // Passes data to state for display
        this.setState({
          photoUser: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  sendFriendRequest = async () => {
    // Gets user ID
    const userID = await AsyncStorage.getItem('@user_id');
    // Gets my seesion token
    const value = await AsyncStorage.getItem('@session_token');

    // Sends friend request to server
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/friends`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        // Error handling
        if (response.status == (201)) {
          alert('Friend Request Sent');
          return response.json();
        } if (response.status == 400) {
          alert('Bad Request\nPlease Try Again');
        } else if (response.status == 401) {
          alert('Unauthorised To Send Request\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Friend Request Pending');
        } else if (response.status == 404) {
          alert('User Not Found\nPlease Try Again Later');
          this.props.navigation.goBack();
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Navigates to user posts
  goToUserPosts = async () => {
    // Sets async postState to 'user'
    await AsyncStorage.setItem('@postsState', 'user');
    // Navigates to
    this.props.navigation.navigate('Posts');
  }

  // If loading state is true, show loading screen
  // Displays different options depending if looking at mine or users profile
  // Displays different options depending if looking at a friends profile
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
    } if (this.state.profileState == 'mine') {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image style={styles.profilePhoto} accessibilityLabel="Your Profile Image" resizeMode="center" source={{ uri: this.state.photo }} />
            <Text style={styles.userName}>{this.state.myName}</Text>
            <View style={styles.buttonContainer}>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('Posts')}>Posts</Button>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('Drafts')}>Drafts</Button>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('SeeFriends')}>Friends</Button>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('UpdateMyInfo')}>Info</Button>
            </View>
          </View>
        </ScrollView>
      );
    } if (this.state.profileState == 'mineSearch') {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image style={styles.profilePhoto} resizeMode="center" accessibilityLabel="Your Profile Image" source={{ uri: this.state.photo }} />
            <Text style={styles.userName}>{this.state.myName}</Text>
            <View style={styles.buttonContainerLarge}>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('Posts')}>Posts</Button>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('Drafts')}>Drafts</Button>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('SeeFriends')}>Friends</Button>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('UpdateMyInfo')}>Info</Button>
              <Button size="lg" color="primary" outline onClick={() => this.props.navigation.goBack()}>Back</Button>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (this.state.profileState == 'user') {
      if (this.state.isFriend) {
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Image style={styles.profilePhotoUser} resizeMode="center" accessibilityLabel="Friends Profile Image" source={{ uri: this.state.photoUser }} />
              <Text style={styles.userName}>{this.state.userName}</Text>
              <View style={styles.buttonContainer}>
                <Button size="lg" color="primary" onClick={() => this.goToUserPosts()}>Posts</Button>
                <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('SeeUserFriends')}>Friends</Button>
                <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('UserInfo')}>Info</Button>
                <Button size="lg" color="primary" outline onClick={() => this.props.navigation.goBack()}>Back</Button>
              </View>
            </View>
          </ScrollView>
        );
      }
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image style={styles.profilePhotoUser} resizeMode="center" accessibilityLabel="Another Users Profile Image" source={{ uri: this.state.photoUser }} />
            <Text style={styles.userName}>{this.state.userName}</Text>
            <View style={styles.buttonContainer}>
              <Button size="lg" color="primary" onClick={() => this.props.navigation.navigate('UserInfo')}>Info</Button>
              <Button size="lg" color="primary" onClick={() => this.sendFriendRequest()}>Add Friends</Button>
              <Button size="lg" color="primary" outline onClick={() => this.props.navigation.goBack()}>Back</Button>
            </View>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({

  container: {
    height: '150%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e5f6ff',
  },

  profilePhoto: {
    minHeight: '335px',
    minWidth: '400px',
    margin: '2px',
  },

  profilePhotoUser: {
    minHeight: '380px',
    minWidth: '400px',
    margin: '2px',
  },

  userName: {
    fontSize: '230%',
    minWidth: 200,
    marginBottom: '20px',
  },

  buttonContainer: {
    height: '24%',
    width: '26%',
    justifyContent: 'space-between',
  },

  buttonContainerLarge: {
    height: '34%',
    width: '24%',
    justifyContent: 'space-between',
  },

});

export default Profile;
