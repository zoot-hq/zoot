import React from 'react'
import { BackHandler } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
// import emojiUtils from 'emoji-utils'

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

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    // // Make "pure emoji" messages much bigger than plain text.
    // if (currText && emojiUtils.isPureEmojiString(currText)) {
    //   messageTextStyle = {
    //     fontSize: 28,
    //     // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
    //     lineHeight: Platform.OS === 'android' ? 34 : 30,
    //   }
    // }

    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => Fire.shared.send(messages, this.state.room)}
        user={this.state.user}
        room={this.state.room}
        renderMessage={this.renderMessage} 
        renderAvatar={null}       
      />
    );
  }
}
