import React, { Component } from 'react';
import {
  Text, FlatList, View, StyleSheet
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button} from 'reactstrap';

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

    console.log(draftCount)

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
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <FlatList
                data={this.state.draftData}
                renderItem={({ item, index }) => (
                  <View  style={styles.allPostsContainer}>
                    <Text>
                      {item}
                    </Text>
                    <Button size="lg" color="primary" onClick={() => this.sendDraft()}>Send</Button>
                    <Button size="lg" color="primary" onClick={() => this.editDraft()}>Edit</Button>
                    <Button size="lg" color="danger" onClick={() => this.deleteDraft()}>Delete</Button>
                  </View>
                )}
              />
              <Button size="lg" color="primary" outline onClick={() => this.props.navigation.goBack()}>Back</Button>
            </ScrollView>
          </View>
        )
      }
    }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "auto",
    minWidth: "900px",
    display: "flex",
    alignItems: 'center',
    backgroundColor: "#e5f6ff"
  },

  content: {
    width: "auto",
    minWidth: 500,
    marginTop: "1%",
  },

  allPostsContainer: {
    marginTop: "1%",
    marginBottom: "2%",
  },
});

export default Drafts;
