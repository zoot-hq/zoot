import React from 'react';
import SlackMessage from './SlackMessage';
import {View, Dimensions, Text} from 'react-native';

let viewWidth = Dimensions.get('window').width;

export default AllReplies = (props) => {
  return (
    <View>
      {props.replies.map((reply) => {
        if (reply.level < 6) {
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
              <SlackMessage {...props} currentMessage={reply} />
            </View>
          );
        } else {
          return <Text>This message's reply limit has been reached.</Text>;
        }
      })}
    </View>
  );
};
