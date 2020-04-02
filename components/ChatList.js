import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Fire from '../Fire';
import { MaterialIndicator } from 'react-native-indicators';
import { Ionicons } from '@expo/vector-icons';

export default class ChatList extends React.Component {
  constructor() {
    super()
    this.state = ({
      chatrooms: [],
      queriedChatrooms: [],
      query: '',
    })
  }

  componentWillMount() {

    // grab chatrooms = every room has a name and numOnline attribute
    Fire.shared.getChatRoomNames((newRoom => {
      const queriedChatrooms = this.state.queriedChatrooms

      // add room to querried rooms if query matches
      if (newRoom.name.toLowerCase().includes(this.state.query.toLowerCase())) {
        queriedChatrooms.push(newRoom)
      }

      // update state
      this.setState({
        chatrooms: [...this.state.chatrooms, newRoom].sort((a, b) => (a.name > b.name) ? 1 : -1),
        queriedChatrooms: queriedChatrooms.sort((a, b) => (a.name > b.name) ? 1 : -1),
      })
    }))

    // update numOnline as it changes in database
    Fire.shared.getUpdatedNumOnline((updatedRoom => {

      this.setState({
        chatrooms: this.state.chatrooms.map(chatroom => {
          if (chatroom.name === updatedRoom.name) {
             return updatedRoom
          }
          return chatroom
        }),
        queriedChatrooms: this.state.queriedChatrooms.map(chatroom => {
          if (chatroom.name === updatedRoom.name) {
             return updatedRoom
          }
          return chatroom
        })
      })
    }))
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerView}>

          {/* titles */}
          <Text style={styles.title}>après</Text>
          <Text style={styles.subtitle}>Welcome.{'\n'}What type support are you here for?</Text >
        </View>
        {/* search bar - queries all chatrooms to the users query */}
        <View style={styles.searchView}>
          < Searchbar
            theme={{ colors: { primary: 'black' } }}
            placeholder="Search our message boards"
            onChangeText={query => {
              const queriedChatrooms = this.state.chatrooms.filter(chatroom => {
                return chatroom.name.toLowerCase().includes(query.toLowerCase())
              })
              this.setState({ queriedChatrooms, query });
              if (!query.length) {
                this.setState({ queriedChatrooms: this.state.chatrooms })
              }
            }}
          />

          {/* chatroom list */}
          <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding" >
            <SafeAreaView >
              <ScrollView contentContainerStyle={{ flexGrow: 1}}>
                {/* if a query made, queried chatrooms displayed*/}
                {(this.state.queriedChatrooms.length) ?
                  this.state.queriedChatrooms.map(chatroom => (
                    <TouchableOpacity
                      key={chatroom.name}
                      style={styles.buttonContainer}
                      onPress={() => this.props.navigation.navigate('ChatRoom', { chatroom: chatroom.name })}
                    >
                      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.buttonText}># {chatroom.name}</Text>
                        <Ionicons name='md-people' size={25} color='grey'> {chatroom.numOnline}</Ionicons>
                      </View>
                    </TouchableOpacity>))
                  :
                  // else allow user to create a new chatroom
                  (this.state.chatrooms.length ?
                    <View>
                      <Text>No results. Would you like to create this chatroom?</Text>
                      <TouchableOpacity
                        key={this.state.query}
                        style={styles.buttonContainer}
                        onPress={() => {
                          Fire.shared.createChatRoom(this.state.query)
                          this.props.navigation.navigate('ChatRoom', { chatroom: this.state.query })
                        }
                        }
                      >
                        <Text style={styles.buttonText}>+ {this.state.query} </Text>
                      </TouchableOpacity>
                    </View>

                    :

                    // return loading while grabbing data from database
                    <MaterialIndicator color='black' />)

                }
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>


        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }} onPress={() => this.props.navigation.navigate('PMList')}>
          <Ionicons name='ios-chatbubbles' size={30} color='grey'></Ionicons>
        </TouchableOpacity>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  chatroomlist: {
    marginBottom: 30
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    flex: 1
  },
  searchView: {
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    flex: 2
  },
  innerView: {
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    flex: 1
  },
  title: {
    bottom: 15,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: "CormorantGaramond-Light",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: "Futura-Light",
    marginTop: 10,
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 28,
    fontFamily: "Futura-Light"
  },
  searchbar: {
    color: 'black',
    marginBottom: 20,
  },
  numOnline: {
    fontSize: 20,
    fontFamily: "Futura-Light"
  }
});