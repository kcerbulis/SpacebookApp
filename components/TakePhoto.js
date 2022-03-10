import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TakePhoto extends Component{
  constructor(props){
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

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
    //Gets user session token
    const value = await AsyncStorage.getItem('@session_token');
    //Gets user ID
    const id = await AsyncStorage.getItem('@session_id');

    let res = await fetch(data.base64);
    let blob = await res.blob()

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
          method: "POST",
          headers: {
            "Content-Type": "image/png",
            'X-Authorization':  value
          },
          body: blob
        })
        .then((response) => {
          alert("New Picture Uploaded!");
          this.props.navigation.navigate("Profile")
        })
        .catch((err) => {
          console.log(err);
        })
  }

  render(){
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>





          <Camera
           style={styles.camera}
           type={this.state.type}
           ref={ref => this.camera = ref}
         >





            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Snap </Text>
              </TouchableOpacity>
            </View>
          </Camera>






        </View>
      );
    }else{
      return(
        <Text>No access to camera</Text>
      );
    }
  }
}

export default TakePhoto;

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
