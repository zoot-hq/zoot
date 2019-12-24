import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { BackHandler } from 'react-native';

export default class Main extends React.Component {
  constructor(){
    super()
    this.state = ({
      query: '',
      chatrooms: ['depression', 'anxiety', 'breastfeeding', 'fitness'],
      queriedChatrooms: []
    })
  }

  // remove back functionality
  componentWillMount(){
    BackHandler.addEventListener('hardwareBackPress', () => { return true })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* titles */}
        <Text style={styles.title}>après</Text>
        <Text style={styles.subtitle}>Welcome. What types of groups are you looking to explore?</Text>

        {/* search bar - queries all chatrooms to the users query */}
        <Searchbar
        style={{ marginTop: 100 }}
        placeholder="Search"
        onChangeText={query => {
          this.setState({ query });
          if (!query.length) {
            this.setState({
              queriedChatrooms: []
            })
          }
          else {
            this.state.chatrooms.forEach(chatroom => {
              if (chatroom.includes(query)){
                this.setState({
                  queriedChatrooms: this.state.queriedChatrooms.concat(chatroom)
                })
              }
            })
          }
        }}
        />

        {/* queried chatrooms*/}
        {this.state.queriedChatrooms.forEach(chatroom => {
          <TouchableOpacity onPress={this.onPress}>
          <Text style={styles.buttonText}>{chatroom}</Text>
        </TouchableOpacity>
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginRight: 50,
    marginLeft: 50,
    justifyContent: 'center',
  },
  title: {
    top: 0,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
  },
  subtitle: {
    top: 0,
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
  }
});