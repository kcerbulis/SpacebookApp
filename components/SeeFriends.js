import React, { Component } from 'react';
import { Button, Text, View, FlatList } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SeeFriends extends Component{
    constructor(props){
        super(props);

        this.state = {
          isLoading: true,
          listData: []
        }


    }



    componentDidMount() {
      this.getData();
    }


    getData = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/search", {
            'headers': {
              'X-Authorization':  value
            }
          })
          .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 401){
                this.props.navigation.navigate("Login");
              }else{
                  throw 'Something went wrong';
              }
          })
          .then((responseJson) => {
            this.setState({
              isLoading: false,
              listData: responseJson
            })
          })
          .catch((error) => {
              console.log(error);
          })
    }








    render(){
        return (
            <ScrollView>


                <View>
                  <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <View>
                              <Text>{item.user_givenname} {item.user_familyname}</Text>
                            </View>
                        )}
                        keyExtractor={(item,index) => item.user_id.toString()}
                      />
                </View>





                <Button title="Go Back" onPress={() => this.props.navigation.goBack()}/>
            </ScrollView>
        )
    }
}

export default SeeFriends;
