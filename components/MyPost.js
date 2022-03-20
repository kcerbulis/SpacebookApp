import {
  Text, FlatList, View, StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'reactstrap';

class MyPost extends Component {
  constructor(props) {
    super(props);

    // Storing post and post update information
    this.state = {
      isLoading: true,
      postData: [],
      request: {},
      updatePostContent: '',
      myPost: false,
    };
  }

  // Loads post when page laods
  componentDidMount() {
    console.log('This is my post');
    this.loadPost();
  }

    // Loads user posts
    loadPost = async () => {
      // Gets token, post and user IDs
      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@session_id');
      const value = await AsyncStorage.getItem('@session_token');
      // Get post server request
      return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${postID}`, {
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
            alert('Post Not Found\nPlease Try Again Later');
            this.props.navigation.goBack();
          } else if (response.status == 500) {
            alert('A Server Error Has Occurred, Please Try Again Later');
            this.props.navigation.goBack();
          } else {
            throw 'Uncought Error Occured';
          }
        })
        .then((responseJson) => {
          // Stops loading view and passes response to state for display
          this.setState({
            isLoading: false,
            postData: responseJson,
          });
          this.checkAuthor(responseJson);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Checks if this post is made by person loggen in
    checkAuthor = async (responseJson) => {
      // Gets sessionsID
      const id = await AsyncStorage.getItem('@session_id');
      // Compares session id to post ID
      // Updates state accordingly
      if (id == responseJson.author.user_id) {
        this.setState({
          myPost: true,
        });
      }
    }

    // Deletes specific post
    deletePost = async (requestingUserID) => {
      // Loading view
      this.state.isLoading = true;
      // Gets token, post and user IDs
      const postID = await AsyncStorage.getItem('@post_id');
      const userID = await AsyncStorage.getItem('@session_id');
      const value = await AsyncStorage.getItem('@session_token');
      // Delete post server request
      return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${postID}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': value,
        },
      })
        .then((response) => {
          console.log(response.status);
          // Error handling
          if (response.status == 200) {
  	         alert('Post Removed');
            this.props.navigation.goBack();
            return response.json();
          } if (response.status == 400) {
            alert('Bad Request\nPlease Try Again');
          } else if (response.status == 401) {
            alert('Unauthorised\nPlease Try Again Later');
            this.props.navigation.navigate('Login');
          } else if (response.status == 403) {
            alert('Forbidden\nYou Can Only Delete Your Own Posts');
            this.props.navigation.goBack();
          } else if (response.status == 404) {
            alert('Post Not Found\nPlease Try Again Later');
            this.props.navigation.goBack();
          } else if (response.status == 500) {
            alert('A Server Error Has Occurred, Please Try Again Later');
            this.props.navigation.goBack();
          } else {
            throw 'Uncought Error Occured';
          }
        })
        .then((responseJson) => {
          // Loading view disabled
          this.state.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Updates specific post content
    updatePost = async (requestingUserID) => {
      // If no info to update, don't update
      if (Object.keys(this.state.updatePostContent).length == 0) {
        alert('Nothing to update');
      }
      // If info present:
      else {
        // Gets token, post and user IDs
        const postID = await AsyncStorage.getItem('@post_id');
        const userID = await AsyncStorage.getItem('@session_id');
        const value = await AsyncStorage.getItem('@session_token');
        // Passes update state information into postData
        this.state.postData.text = this.state.updatePostContent;
        // Sets updated text as request body
        const body = this.state.postData;
        // Update post server request
        return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${postID}`, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
            'X-Authorization': value,
          },
          // Stringifies body to JSON
          body: JSON.stringify(body),
        })
          .then((response) => {
            console.log(response.status);
            // Error handling
            if (response.status == 200) {
  	        alert('Post Updated');
              this.props.navigation.goBack();
              return response.json();
            } if (response.status == 400) {
              alert('Bad Request\nPlease Try Again');
            } else if (response.status == 401) {
              alert('Unauthorised\nPlease Try Again Later');
              this.props.navigation.navigate('Login');
            } else if (response.status == 403) {
              alert('Forbidden\nYou Can Only Update Your Own Posts');
              this.props.navigation.goBack();
            } else if (response.status == 404) {
              alert('Post Not Found\nPlease Try Again Later');
              this.props.navigation.goBack();
            } else if (response.status == 500) {
              alert('A Server Error Has Occurred, Please Try Again Later');
              this.props.navigation.goBack();
            } else {
              throw 'Uncought Error Occured';
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

  // Likes an individual post
  likePost = async () => {
    // Gets token, post and user IDs
    const userPostID = await AsyncStorage.getItem('@post_id');
    const userID = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    // Like post server request
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${userPostID}/like`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        console.log(response.status);
        // Error handling
        if (response.status == 200) {
	        alert('Post Liked');
          this.props.navigation.goBack();
          return response.json();
        } if (response.status == 400) {
          alert('Bad Request\nPlease Try Again');
        } else if (response.status == 401) {
          alert('Unauthorised\nPlease Try Again Later');
          this.props.navigation.navigate('Login');
        } else if (response.status == 403) {
          alert('Forbidden\nPost Already Liked or Post Not Made by Your Friend\n*POTENTIAL KNOWN SERVER ERROR*');
          this.props.navigation.goBack();
        } else if (response.status == 404) {
          alert('Post Not Found\nPlease Try Again Later');
          this.props.navigation.goBack();
        } else if (response.status == 500) {
          alert('A Server Error Has Occurred, Please Try Again Later');
          this.props.navigation.goBack();
        } else {
          throw 'Uncought Error Occured';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

   // Unlike an individual post
   unlikePost = async () => {
     // Gets token, post and user IDs
     const userPostID = await AsyncStorage.getItem('@post_id');
     const userID = await AsyncStorage.getItem('@session_id');
     const value = await AsyncStorage.getItem('@session_token');

     // Unlike post server request
     return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post/${userPostID}/like`, {
       method: 'delete',
       headers: {
         'Content-Type': 'application/json',
         'X-Authorization': value,
       },
     })
       .then((response) => {
         // Error handling
         console.log(response.status);
         if (response.status == 200) {
	        alert('Like Removed');
           this.props.navigation.goBack();
           return response.json();
         } if (response.status == 400) {
           alert('Bad Request\nPlease Try Again');
         } else if (response.status == 401) {
           alert('Unauthorised\nPlease Try Again Later');
           this.props.navigation.navigate('Login');
         } else if (response.status == 403) {
           alert('Forbidden\nPost Not Liked or Post Not Made by Your Friend\n*POTENTIAL KNOWN SERVER ERROR*');
           this.props.navigation.goBack();
         } else if (response.status == 404) {
           alert('Post Not Found\nPlease Try Again Later');
           this.props.navigation.goBack();
         } else if (response.status == 500) {
           alert('A Server Error Has Occurred, Please Try Again Later');
           this.props.navigation.goBack();
         } else {
           throw 'Uncought Error Occured';
         }
       })
       .catch((error) => {
         console.log(error);
       });
   }

   // Shows loading screen while data is Loading
   // If my post: update or delete functionality
   // If user post: like or unlike functionality
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
     } if (this.state.myPost) {
       return (
         <View style={styles.container}>
           <ScrollView>
             <View>
               <TextInput style={styles.textInput} defaultValue={this.state.postData.text} onChangeText={(value) => this.setState({ updatePostContent: value })} />
             </View>
             <View style={styles.buttonContainer}>
               <Button size="lg" outline color="primary" onClick={() => this.updatePost()}>Update</Button>
               <Button size="lg" outline color="danger" onClick={() => this.deletePost()}>Delete</Button>
               <Button size="lg" outline color="primary" onClick={() => this.props.navigation.goBack()}>Back</Button>
             </View>
           </ScrollView>
         </View>
       );
     }
     return (
       <View style={styles.container}>
         <ScrollView>
           <View>
             <TextInput style={styles.textInput} defaultValue={this.state.postData.text} onChangeText={(value) => this.setState({ updatePostContent: value })} />
           </View>
           <View style={styles.buttonContainer}>
             <Button size="lg" outline color="primary" onClick={() => this.likePost()}>Like</Button>
             <Button size="lg" outline color="danger" onClick={() => this.unlikePost()}>Unlike</Button>
             <Button size="lg" outline color="primary" onClick={() => this.props.navigation.goBack()}>Back</Button>
           </View>
         </ScrollView>
       </View>
     );
   }
}

// Styling
const styles = StyleSheet.create({

  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e5f6ff',
  },

  textInput: {
    fontWeight: 500,
    padding: 13,
    borderWidth: 1,
    borderRadius: 40,
    margin: 8,
  },

  buttonContainer: {
    height: 'auto',
    width: '20%',
    marginTop: '2%',
    flexDirection: 'row',
  },

});

export default MyPost;
