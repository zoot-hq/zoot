import React from 'react';
import SingleReply from './SingleReply';
import SlackBubble from './SlackBubble';
import SlackMessage from './SlackMessage';
import {View, Text} from 'react-native';
import * as firebase from 'firebase';
import Fire from '../Fire';
import {GiftedChat} from 'react-native-gifted-chat';

export default class AllReplies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indent: this.props.parentIndent,
      messages: [],
      room: this.props.room,
      pm: this.props.pm,
      live: this.props.live
    };
  }
  onSend(messages = []) {
    Fire.shared.send(messages, this.state.room, this.state.pm, this.state.live);
  }
  renderMessage(props) {
    const {
      currentMessage: {text: currText}
    } = props;

    let messageTextStyle;
    return (
      <SlackMessage
        {...props}
        messageTextStyle={messageTextStyle}
        currentMessage={{
          user: {name: firebase.auth().currentUser.displayName},
          flags: {count: 0},
          hidden: false,
          lightbulbs: {count: 0},
          likes: {count: 0},
          loves: {count: 0},
          createdAt: new Date(),
          text: 'Can I add text with the new message?'
        }}
      />
    );
  }
  render() {
    return (
      <View>
        {this.props.replies.map((reply, idx) => {
          return (
            <View
              style={{
                marginLeft: this.props.parentIndent + 10,
                borderLeftWidth: 1
              }}
            >
              {/* <SlackMessage
                {...this.props}
                currentMessage={{
                  user: {name: firebase.auth().currentUser.displayName},
                  flags: {count: 0},
                  hidden: false,
                  lightbulbs: {count: 0},
                  likes: {count: 0},
                  loves: {count: 0},
                  createdAt: new Date(),
                  text: 'Can I add text with the new message?'
                }}
              /> */}
              <GiftedChat
                messages={this.state.messages}
                onSend={(messages) => this.onSend(messages)}
                renderMessage={this.renderMessage}
                user={{
                  _id: Fire.shared.uid()
                }}
              />
            </View>
          );
        })}
      </View>
    );
  }
}
