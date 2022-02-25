import React, { Component } from 'react';
import { Button, Text } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class MyPost extends Component{
    constructor(props){
        super(props);

    }





    render(){
        return (
          <ScrollView>
            <Text>
              My individual post screen- 9, 11, 17, 20
            </Text>
            <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
          </ScrollView>
        )
    }
}

export default MyPost;
