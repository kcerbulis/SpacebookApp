import React, { Component } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Button} from 'reactstrap';

class Accessibility extends Component {
  constructor(props) {
    super(props);

  }


  ibmWebsite = async () => {
    console.log("AAAAas")
    window.open("https://www.ibm.com/design/language/color/", '_blank').focus();
  }

  windowsWebsite = async () => {
    console.log("AAAAas")
    window.open("https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1", '_blank').focus();
  }

  macWebsite = async () => {
    console.log("AAAAas")
    window.open("https://www.disability.illinois.edu/academic-support/assistive-technology/mac-os-x-voiceover#:~:text=Mac%20OS%20X%20Snow%20Leopard,new%20web%20page%20support%20options.", '_blank').focus();
  }

  androidWebsite = async () => {
    console.log("AAAAas")
    window.open("https://support.google.com/accessibility/android/answer/6283677?hl=en-GB", '_blank').focus();
  }

  iOSWebsite = async () => {
    console.log("AAAAas")
    window.open("https://developer.apple.com/accessibility/ios/", '_blank').focus();
  }



    // Signup text input fields, updates state on key change
    render() {
      return (
        <View style={styles.buttonContainer}>
          <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.ibmWebsite()}>Vision Friendly Color Palette</Button>
          <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.windowsWebsite()} >Windows Screen Reder</Button>
          <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.macWebsite()} >Mac Screen Reder</Button>
          <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.androidWebsite()} >Android Screen Reder</Button>
          <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.iOSWebsite()} >iOS Screen Reder</Button>
          <Button size="lg" outline color="primary" style={styles.plz} onClick={() => this.props.navigation.goBack()}>Go Back</Button>
        </View>
      );
    }
}

// Styling
const styles = StyleSheet.create({

});

export default Accessibility;
