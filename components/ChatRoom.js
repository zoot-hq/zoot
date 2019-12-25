import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import Fire from '../Fire';
import { BackHandler } from 'react-native';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      room: this.props.navigation.state.params.chatroom,
      messages: [],
      user: {
        username: Fire.shared.username(),
        _id: Fire.shared.uid(),
      }
    };
  }


  componentDidMount() {
    // add back functionality
    BackHandler.addEventListener('hardwareBackPress', () => { this.props.navigation.navigate('ChatList') })

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

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => Fire.shared.send(messages, this.state.room)}
        user={this.state.user}
        room={this.state.room}
      />
    );
  }
}
