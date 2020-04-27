import React from 'react';
import SlackMessage from './SlackMessage';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import * as firebase from 'firebase';
import Fire from '../Fire';

export default class AllReplies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indent: this.props.parentIndent + 10,
      messages: [],
      pm: false,
      live: this.props.live,
      text: 'sample text',
      reply: true,
      replyComplete: false
    };
  }
  async sendReply(replyIdx) {
    const messages = [
      {text: this.state.text, user: firebase.auth().currentUser.displayName}
    ];
    await Fire.shared.send(
      messages,
      this.props.replies[replyIdx].parentRoom,
      false,
      false,
      true,
      this.props.replies[replyIdx].parentId
    );
  }
  render() {
    console.log('an attempt was made to render AllReplies');
    return (
      <View>
        {this.props.replies.map((reply, idx) => {
          return (
            <View
              style={{
                marginLeft: this.state.indent,
                borderLeftWidth: 1
              }}
            >
              <SlackMessage
                {...this.props}
                key={reply.id}
                currentMessage={reply}
              />
              {/* {this.state.replyComplete ? (

              ) : (
                <TextInput
                  placeholder="type your reply"
                  onChangeText={(text) => this.setState({text})}
                />
              )} */}
              <TouchableOpacity onPress={() => this.sendReply(idx)}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}
