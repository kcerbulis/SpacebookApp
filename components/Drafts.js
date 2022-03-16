import React, { Component } from 'react';
import {
  Button, Text, FlatList, View,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Drafts extends Component {
  constructor(props) {
    super(props);

    // Storing information about posts
    this.state = {
      isLoading: false,
      draftData: [],
    };
  }

  //Gets draft count when page is loaded
  async componentDidMount() {
    this.getDraftCount();
  }

  getDraftCount = async () => {
    //Accesses draft count number
    let draftCount = await AsyncStorage.getItem('@draftCount');
    //For ever entry in drafts
    for (let i = 1; i <= draftCount; i ++){
      //Gets correct draft
      let savedDraft = await AsyncStorage.getItem('@draftNr' + i);
      //Adds it to stae
      this.setState({
         draftData: [...this.state.draftData, savedDraft] })
     }
  }

  //Draft send, edit and delete functionality
  sendDraft = async () =>{
    console.log("Draft Sent")
  }

  editDraft = async () =>{
    console.log("Draft Edited")
  }

  deleteDraft = async () =>{
    console.log("Draft Deleted")
  }

    //When loading, show loading screen
    //Displaty all user drafts with send, edit delte button functionality
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
      else{
        return(
          <ScrollView>
            <FlatList
              data={this.state.draftData}
              renderItem={({ item, index }) => (
                <View>
                  <Text>
                    {item}
                  </Text>
                  <Button title="Send" onPress={() => this.sendDraft()} />
                  <Button title="Edit" onPress={() => this.editDraft()} />
                  <Button title="Delete" onPress={() => this.deleteDraft()} />
                </View>
              )}
            />
            <Button title="Go Back" onPress={() => this.props.navigation.goBack()} />
          </ScrollView>
        )
      }
    }
}

export default Drafts;
