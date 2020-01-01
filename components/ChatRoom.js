import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { MaterialIndicator } from 'react-native-indicators';

import SlackMessage from './SlackMessage'
import Fire from '../Fire';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      room: this.props.navigation.state.params.chatroom,
      messages: [],
      user: {
        name: Fire.shared.username(),
        _id: Fire.shared.uid(),
      },
      loadEarlier: true
    };
  }


  componentDidMount = () => {

    //get messages for chatroom
    Fire.shared.on(this.state.room, (message => {
      if(message.text === `Welcome to # ${this.state.room} - send a message to get the conversation started`) {
        this.setState( { loadEarlier : false})
      }
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    }));
  }
  
  componentWillUnmount() {
    Fire.shared.off();
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle
    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  // load earlier messages from backend
  loadEarlier = async () => {

    // remove load earlier button while loading
    this.setState( {loadEarlier : false})

    const newMessages = []

    for (let i = 0 ; i < 10; i ++) {
      await Fire.shared.loadEarlier(this.state.room, this.state.messages[this.state.messages.length-1], (message => {
        newMessages.push(message)
      }))

      if(newMessages[0].text === `Welcome to # ${this.state.room} - send a message to get the conversation started`) {
        this.setState( { loadEarlier : false })
      }

      this.setState(previousState => ({
        messages: GiftedChat.prepend(previousState.messages, newMessages.pop()),
      }))

    }

    // rerender load earlier button when complete
    this.setState( {loadEarlier : true})
  }

  // load earlier button
  renderLoadEarlier() {
    // if messages have been grabbed, display
    if (this.state.messages[0]) {
      return (
        <TouchableOpacity style={styles.buttonContainer} onPress={this.loadEarlier}>
          <Text style={styles.buttonText}>
            load earlier messages
          </Text>
       </TouchableOpacity>
      ) 
    } 
  }

  render() {

    return (
      <View style={{flex:1}}>
        <Text style={styles.title}># {this.state.room}</Text>
          <GiftedChat
            messages={this.state.messages}
            onSend={(messages) => Fire.shared.send(messages, this.state.room)}
            user={this.state.user}
            renderMessage={this.renderMessage} 
            renderAvatar={null}
            renderLoading={() =>  <MaterialIndicator color='black' />}
            renderLoadEarlier={() => this.renderLoadEarlier()}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    top: 0,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 30
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
  },
});

