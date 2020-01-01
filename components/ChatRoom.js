import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
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
    const newMessages = []

    for (let i = 0 ; i < 10; i ++) {
      await Fire.shared.loadEarlier(this.state.room, this.state.messages[this.state.messages.length-1], (message => {
        newMessages.push(message)
      }))

      if(newMessages[0] === `Welcome to # ${this.state.room} - send a message to get the conversation started`) {
        this.setState( { loadEarlier : false })
      }

      this.setState(previousState => ({
        messages: GiftedChat.prepend(previousState.messages, newMessages.pop()),
      }))

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
            room={this.state.room}
            renderMessage={this.renderMessage} 
            renderAvatar={null}
            renderLoading={() =>  <MaterialIndicator color='black' />}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.loadEarlier}
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
  }
});

