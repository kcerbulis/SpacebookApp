import React, { Component } from 'react';
import {
  Text, FlatList, View, StyleSheet,
} from 'react-native';
import { Button } from 'reactstrap';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Posts extends Component {
  constructor(props) {
    super(props);

    // Storing information about posts
    this.state = {
      isLoading: false,
      postData: [],
      postContent: '',
      userPostContent: '',
      postsState: '',
    };
  }

  async componentDidMount() {
    console.log('Looking at draftable posts');

    // Gets string of 'mine' or 'user'
    const postsState = await AsyncStorage.getItem('@postsState');

    // Runs when page is focused on
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // Sets state to whos posts looking at
      this.checkWhosPosts();
      // Loads posts depending postState
      if (postsState == 'mine') {
        this.loadPosts();
      } else if (postsState == 'user') {
        this.loadPostsUser();
      }
    });
  }

    // Sets state to postState async
    checkWhosPosts = async () => {
      // Stores who's profile needs to be displayed
      const postsState = await AsyncStorage.getItem('@postsState');
      // Sets state of whos profile looking at
      await this.setState({
        postsState,
      });
    }

    // Loads user posts
    loadPosts = async () => {
      // Loading view
      this.setState({
        isLoading: true,
      });

      // Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      // Gets user ID
      const id = await AsyncStorage.getItem('@session_id');

      // Posts server request
      return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
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
            alert('Forbidden\nYou Can Only View the Posts of Yourself or Your Friends');
            this.props.navigation.goBack();
          } else if (response.status == 404) {
            alert('Posts Not Found\nPlease Try Again Later');
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
            listData: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Loads user posts
    loadPostsUser = async () => {
      // Loading view
      this.setState({
        isLoading: true,
      });
      // Gets user session token
      const value = await AsyncStorage.getItem('@session_token');
      // Gets user ID
      const id = await AsyncStorage.getItem('@user_id');
      // Load user posts server request
      return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
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
            alert('Forbidden\nYou Can Only View the Posts of Yourself or Your Friends');
            this.props.navigation.goBack();
          } else if (response.status == 404) {
            alert('Posts Not Found\nPlease Try Again Later');
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
            listDataUser: responseJson,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Uploads new post and displays in window
    uploadNewPost = async () => {
      if (this.state.postContent == '') {
        alert('Nothing To Post');
      } else {
        // Gets user session token
        const value = await AsyncStorage.getItem('@session_token');
        // Gets user ID
        const id = await AsyncStorage.getItem('@session_id');
        // Request body taken from state
        const postContentVar = {
          text: this.state.postContent,
        };
        // Upload post server request
        return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': value,
          },
          body: JSON.stringify(postContentVar),
        })
          .then((response) => {
            console.log(response.status);
            // Error handling
            if (response.status == 201) {
              return response.json();
            } if (response.status == 400) {
              alert('Bad Request\nPlease Try Again');
            } else if (response.status == 401) {
              alert('Unauthorised\nPlease Try Again Later');
              this.props.navigation.navigate('Login');
            } else if (response.status == 403) {
              alert('Forbidden\nYou Can Only Post on Your and Your Friends Profiles');
              this.props.navigation.goBack();
            } else if (response.status == 404) {
              alert('Profile Not Found\nPlease Try Again Later');
              this.props.navigation.goBack();
            } else if (response.status == 500) {
              alert('A Server Error Has Occurred, Please Try Again Later');
            } else {
              throw 'Uncought Error Occured';
            }
          })
          .then((responseJson) => {
            // Clears new post input window
            this.state.postContent = '';
            // Reloads post list
            this.loadPosts();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    // Uploads new post to user and displays in  window
    uploadNewPostUser = async () => {
      if (this.state.userPostContent == '') {
        alert('Nothing To Post');
      } else {
        // Gets user session token
        const value = await AsyncStorage.getItem('@session_token');
        // Gets user ID
        const id = await AsyncStorage.getItem('@user_id');
        // Request body taken from state
        const postContentVar = {
          text: this.state.userPostContent,
        };
        // Upload user post server request
        return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': value,
          },
          body: JSON.stringify(postContentVar),
        })
          .then((response) => {
            console.log(response.status);
            // Error handling
            if (response.status == 201) {
              return response.json();
            } if (response.status == 400) {
              alert('Bad Request\nPlease Try Again');
            } else if (response.status == 401) {
              alert('Unauthorised\nPlease Try Again Later');
              this.props.navigation.navigate('Login');
            } else if (response.status == 403) {
              alert('Forbidden\nYou Can Only Post on Your and Your Friends Profiles');
              this.props.navigation.goBack();
            } else if (response.status == 404) {
              alert('Profile Not Found\nPlease Try Again Later');
              this.props.navigation.goBack();
            } else if (response.status == 500) {
              alert('A Server Error Has Occurred, Please Try Again Later');
            } else {
              throw 'Uncought Error Occured';
            }
          })
          .then((responseJson) => {
            // Clears new post input window
            this.state.userPostContent = '';
            this.loadPostsUser();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    // Saves new draft in async storage
    saveToDrafts = async () => {
      // If no info to update, don't update
      if (Object.keys(this.state.postContent).length == 0) {
        alert('Nothing To Save');
      } else {
        // Gets old draft number
        const oldDraftCount = await AsyncStorage.getItem('@draftCount');
        // Updates draft count
        await AsyncStorage.setItem('@draftCount', parseInt(oldDraftCount) + 1);
        // Gets new draft count
        const currentDraftNumber = await AsyncStorage.getItem('@draftCount');
        // Dynamically saves draft in async storage
        await AsyncStorage.setItem(`@draftNr${currentDraftNumber}`, this.state.postContent);
        // Clears text field
        this.state.postContent = '';
        alert('Message Saved To Drafts');
        // Reloads posts
        this.loadPosts();
      }
    }

    // Navigates to single post inspection for users own posts
    inspecPost = async (postID, userID) => {
      // Passes post ID into async storage
      await AsyncStorage.setItem('@post_id', postID);
      // Navigates user to MyPost view
      this.props.navigation.navigate('MyPost');
    }

    // Navigates to single post inspection for other users posts
    inspecPostUser = async (postID, profileID) => {
      // Passes post ID into async storage
      await AsyncStorage.setItem('@post_id', postID);
      // Passes post profile ID into async storage
      await AsyncStorage.setItem('@profile_id', profileID);
      // Navigates user to UserPost view
      this.props.navigation.navigate('UserPost');
    }

    // If loading state is true, show loading screen
    // Displays different options depending if looking at mine or users posts
    // Displays different options depending if looking at a friends posts
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
      } if (this.state.isLoading == false) {
        if (this.state.postsState == 'mine') {
          return (
            <View style={styles.container}>
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.contentView}>
                  <TextInput style={styles.textInput} placeholder="Type a new post here..." onChangeText={(value) => this.setState({ postContent: value })} value={this.state.postContent} />
                  <View style={styles.postBtnContainer}>
                    <Button size="lg" color="primary" onClick={() => { this.uploadNewPost(); }}>Publish</Button>
                    <Button size="lg" color="primary" outline onClick={() => { this.saveToDrafts(); }}>Draft</Button>
                  </View>
                  <View style={styles.allPostsContainer}>
                    <FlatList
                      data={this.state.listData}
                      renderItem={({ item, index }) => (
                        <View style={styles.individualPost}>
                          <Button size="sm" color="primary" outline onClick={() => this.inspecPost(item.post_id, item.author.user_id)}>
                            <Text>
                              {item.author.first_name}
                              :
                              {' '}
                              {item.text}
                              {' '}
                              [
                              {item.numLikes}
                              {' '}
                              likes]
                            </Text>
                          </Button>
                        </View>

                      )}
                    />
                    <View style={styles.backButtonContainer}>
                      <Button size="lg" color="primary" onClick={() => this.props.navigation.goBack()}>Back</Button>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          );
        }
        return (

          <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.contentView}>
                <TextInput style={styles.textInput} placeholder="Type a new post here..." onChangeText={(value) => this.setState({ userPostContent: value })} value={this.state.userPostContent} />
                <View style={styles.postBtnContainer}>
                  <Button size="lg" color="primary" onClick={() => { this.uploadNewPostUser(); }}>Publish</Button>
                </View>
                <View style={styles.allPostsContainer}>
                  <FlatList
                    data={this.state.listDataUser}
                    renderItem={({ item, index }) => (
                      <View style={styles.individualPost}>
                        <Button size="sm" color="primary" outline onClick={() => this.inspecPostUser(item.post_id, item.author.user_id)}>
                          <Text>
                            {item.author.first_name}
                            :
                            {' '}
                            {item.text}
                            {' '}
                            [
                            {item.numLikes}
                            {' '}
                            likes]
                          </Text>
                        </Button>
                      </View>

                    )}
                  />
                  <View style={styles.backButtonContainer}>
                    <Button size="lg" color="primary" onClick={() => this.props.navigation.goBack()}>Back</Button>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

        );
      }
    }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: 'auto',
    minWidth: '500px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e5f6ff',
  },

  content: {
    width: 'auto',
    minWidth: 500,
    marginTop: '1%',
  },

  textInput: {
    fontWeight: 500,
    padding: 13,
    borderWidth: 1,
    borderRadius: 40,
    margin: 8,
  },

  postBtnContainer: {
    width: 'auto',
    marginTop: '4%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  allPostsContainer: {
    marginTop: '5%',
    marginBottom: '2%',
    alignItems: 'center',
  },

  individualPost: {
    flexDirection: 'row',
    marginLeft: '20px',
    marginBottom: '10px',
  },

  backButtonContainer: {
    marginTop: '2%',
    width: '57%',
  },
});

export default Posts;
