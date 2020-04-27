import React from 'react';
import SlackMessage from './SlackMessage';
import {View} from 'react-native';

export default AllReplies = (props) => {
  return (
    <View>
      {props.replies.map((reply) => {
        return (
          <View
            style={{
              marginLeft: props.parentIndent + 10,
              borderLeftWidth: 1
            }}
          >
            <SlackMessage {...props} key={reply._id} currentMessage={reply} />
          </View>
        );
      })}
    </View>
  );
};
