import React, {Component} from 'react';
import SlackMessage from './SlackMessage';
import {View, Dimensions} from 'react-native';

let viewWidth = Dimensions.get('window').width;

export default class AllReplies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: this.props.replies
    };
    this.renderNewReply = this.renderNewReply.bind(this);
  }
  renderNewReply(message) {
    const newReplies = this.state.replies.slice();
    newReplies.push(message);
    this.setState({replies: newReplies});
  }
  render() {
    return (
      <View>
        {this.state.replies.map((reply) => {
          return (
            <View
              key={reply._id}
              style={{
                marginLeft: 10,
                borderLeftWidth: 0.5,
                borderColor: 'gray'
                // this is supposed to prevent the text input from growing beyond the screen size
                // width: viewWidth - 20,
              }}
            >
              <SlackMessage
                {...this.props}
                renderNewReply={this.renderNewReply}
                currentMessage={reply}
              />
            </View>
          );
        })}
      </View>
    );
  }
}
