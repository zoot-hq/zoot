// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

import Fire from '../Fire';

class Chat extends React.Component {

  state = {
    messages: [],
    user: {
      username: Fire.shared.username(),
      _id: Fire.shared.uid(),
    }
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.state.user}
      />
    );
  }

  componentDidMount() {
    Fire.shared.on(message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    });
  }
  componentWillUnmount() {
    Fire.shared.off();
  }
}

export default Chat;
