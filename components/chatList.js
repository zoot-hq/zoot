import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { BackHandler } from 'react-native';

export default class chatList extends React.Component {
  constructor(){
    super()
    this.state = ({
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
        theme={{colors: {primary: 'black'}}}
        placeholder="Search"
        onChangeText={query => {
          const queriedChatrooms = this.state.chatrooms.filter(chatroom => {
            return chatroom.includes(query.toLowerCase())
          })
          this.setState({ queriedChatrooms });
        }}
        />

        {/* if a query made, queried chatrooms displayed*/}
        {this.state.queriedChatrooms.length?
          this.state.queriedChatrooms.map(chatroom => (
          <TouchableOpacity key={chatroom} style={styles.buttonContainer}>
          <Text style={styles.buttonText}># {chatroom}</Text>
        </TouchableOpacity>))
        :
        // else display all chatrooms
        this.state.chatrooms.map(chatroom => (
          <TouchableOpacity key={chatroom} style={styles.buttonContainer}>
          <Text style={styles.buttonText}># {chatroom}</Text>
        </TouchableOpacity>))
        }
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
    marginBottom: 20,
  },
  subtitle: {
    top: 0,
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 5,
    marginTop: 5,
    marginLeft: 5
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
  },
  searchbar: {
    color: 'black',
    marginBottom: 20
  }
});