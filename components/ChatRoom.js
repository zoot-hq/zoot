import React from 'react'
import { BackHandler, View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
        avatar: 'https://placeimg.com/140/140/any'
      }
    };
  }


  componentDidMount() {

    //get messages for chatroom
    Fire.shared.on(message => {
      if (message.room === this.state.room){
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      } 
    });
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

  render() {

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <GestureRecognizer
        onSwipeRight={() => {this.props.navigation.navigate('ChatList')}}
        config={config}
        style={{
          flex: 1
        }}
        >
        <Text style={styles.title}># {this.state.room}</Text>
        <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={(messages) => Fire.shared.send(messages, this.state.room)}
            user={this.state.user}
            room={this.state.room}
            renderMessage={this.renderMessage} 
            renderAvatar={null}
          />
        </KeyboardAvoidingView>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    top: 0,
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20
  }
});

