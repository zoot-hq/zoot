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
      query: ''
    })
  }

  componentWillMount() {
    //grab chatrooms
    Fire.shared.getChatRoomNames((room => {
      this.setState({
        chatrooms: [...this.state.chatrooms, room],
        queriedChatrooms: [...this.state.queriedChatrooms, room]
      })
    }));
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
            placeholder="Search for public chatrooms"
            onChangeText={query => {
              const queriedChatrooms = this.state.chatrooms.filter(chatroom => {
                return chatroom.toLowerCase().includes(query.toLowerCase())
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
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* if a query made, queried chatrooms displayed*/}
                {(this.state.queriedChatrooms.length) ?
                  this.state.queriedChatrooms.map(chatroom => (
                    <TouchableOpacity
                      key={chatroom}
                      style={styles.buttonContainer}
                      onPress={() => this.props.navigation.navigate('ChatRoom', { chatroom })}
                    >
                      <Text style={styles.buttonText}># {chatroom}</Text>
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
                          Fire.shared.createRoom(this.state.query)
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

        <View style={styles.searchView}>
          <Searchbar
            theme={{ colors: { primary: 'black' } }}
            placeholder="Search for partnered organizations"
            onChangeText={query => {
              const queriedChatrooms = this.state.chatrooms.filter(chatroom => {
                return chatroom.toLowerCase().includes(query.toLowerCase())
              })
              this.setState({ queriedChatrooms, query });
              if (!query.length) {
                this.setState({ queriedChatrooms: this.state.chatrooms })
              }
            }}
          />

          {/*TO DO: REPLACE PUBLIC CHATS WITH LINKS TO ORGANIZATION CHAT ROOM LISTS */}
          {/*TO DO: POPUP TO REQUEST TO JOIN ORG IF NOT ALREADY A MEMBER*/}
          <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding" >
            <SafeAreaView >
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* if a query made, queried chatrooms displayed*/}
                {(this.state.queriedChatrooms.length) ?
                  this.state.queriedChatrooms.map(chatroom => (
                    <TouchableOpacity
                      key={chatroom}
                      style={styles.buttonContainer}
                      onPress={() => this.props.navigation.navigate('ChatRoom', { chatroom })}
                    >
                      <Text style={styles.buttonText}># {chatroom}</Text>
                    </TouchableOpacity>))
                  :
                  // no results -- DO NOT create new partnered chats from UI
                  (this.state.chatrooms.length ?
                    <View>
                      <Text>No results.</Text>
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
    minHeight: 100,
    maxHeight: 195,
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
    paddingVertical: 5,
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
  }
});