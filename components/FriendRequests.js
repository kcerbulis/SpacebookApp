import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import { ScrollView} from 'react-native-gesture-handler';

class FriendRequests extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <Text>Friend Requests - 8, 14, 19</Text>
        <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
});

export default FriendRequests
