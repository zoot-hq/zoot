import React from 'react';
import SlackMessage from './SlackMessage';
import { View, Dimensions } from 'react-native';

let viewWidth = Dimensions.get('window').width;

export default AllReplies = (props) => {
  return (
    <View>
      {props.replies.map((reply) => {
        return (
          <View
            key={reply._id}
            style={{
              marginLeft: props.parentIndent + 10,
              borderLeftWidth: 1,
              // this is supposed to prevent the text input from growing beyond the screen size
              maxWidth: viewWidth - (props.parentIndent + 20)
            }}
          >
            <SlackMessage {...props} currentMessage={reply} />
          </View>
        );
      })}
    </View>
  );
};
