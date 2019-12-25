import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import Fire from '../Fire';
import { BackHandler } from 'react-native';

class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
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
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))  
    });
  }
  
  componentWillUnmount() {
    Fire.shared.off();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.state.user}
      />
    );
  }
}

export default Chat;
