import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TakePhoto extends Component{
  constructor(props){
    super(props);

    //Stores picture capture data
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount(){
    //Asks for device permission to tale photos
    const { status } = await Camera.requestCameraPermissionsAsync();
    //Updates permission state
    this.setState({hasPermission: status === 'granted'});
  }

  //Sets camera option and passes it into takePictureAsync function
  //Once picture takes, data sent to server with sendToServer function
  takePicture = async() => {
    if(this.camera){
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data)
      };
      await this.camera.takePictureAsync(options);
    }
  }

  sendToServer = async (data) => {
    //Gets session token
    const value = await AsyncStorage.getItem('@session_token');
    //Gets session ID
    const id = await AsyncStorage.getItem('@session_id');

    //Converts data into base64 and turns in into blob to send to server as body
    let res = await fetch(data.base64);
    let blob = await res.blob()

    //POST request to send picture to server
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
          method: "POST",
          headers: {
            "Content-Type": "image/png",
            'X-Authorization':  value
          },
          body: blob
        })
        .then((response) => {
          //Error handling
          if(response.status == (200 || 201)){
            alert("Photo Uploaded")
            this.props.navigation.navigate("Profile")
          }else if(response.status == 400){
            alert("Bad Request, Please Try Again");
            this.props.navigation.goBack();
          }else if(response.status == 401){
            alert("You Are Unauthorised to Do This")
            this.props.navigation.navigate("Login");
          }else if(response.status == 404){
            alert("User Not Found, Please Try Again");
            this.props.navigation.goBack();
          }else if(response.status == 500){
            alert("A Server Error Has Occurred, Please Try Again Later");
            this.props.navigation.goBack();
          }else{
            alert("An Uncaught Error Has Occurred :(\nPlease Try Again Later");
            this.props.navigation.goBack();
          }
        })
        .catch((err) => {
          console.log(err);
        })
  }

  render(){
    //If camera access is granted, displays photo taking mode
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera style={styles.camera} type={this.state.type} ref={ref => this.camera = ref}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {this.takePicture();}}>
                <Text style={styles.text}>Snap</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else{
      //If camera access is denied
      return(
        <Text>No access to camera</Text>
      );
    }
  }
}

//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default TakePhoto;
