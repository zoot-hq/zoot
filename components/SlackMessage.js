import PropTypes from 'prop-types';
import React from 'react';
import {Text, View, ViewPropTypes, StyleSheet} from 'react-native';
import {Day, utils} from 'react-native-gifted-chat';
import Bubble from './SlackBubble';

const {isSameUser, isSameDay} = utils;

export default class Message extends React.Component {
  componentDidMount() {
    console.log('component did mount firing in slack message');
  }
  getInnerComponentProps() {
    console.log('getInnerComponentProps firing in slack message');
    const {containerStyle, ...props} = this.props;
    return {
      ...props,
      position: 'left',
      isSameUser,
      isSameDay
    };
  }

  // renderDay() {
  //   console.log(this.props.renderDay, 'render day is here - line 21');
  //   if (
  //     this.props.currentMessage.createdAt &&
  //     !this.props.currentMessage.isReply &&
  //     this.props.listViewProps.navigation.state.params.PM
  //   ) {
  //     const dayProps = this.getInnerComponentProps();
  //     if (this.props.renderDay) {
  //       return this.props.renderDay(dayProps);
  //     }
  //     return <Day {...dayProps} />;
  //   }
  //   return null;
  // }
  // this method is called in the main render method to render the actions after the message text
  renderBubble() {
    console.log('render bubble firing in slack message');
    // if this slack message was rendered via the AllReplies component, meaning it's rendering a reply, it has to keep passing down the "render new reply" method from that component.
    const renderNewReplyMethod = this.props.renderNewReply
      ? this.props.renderNewReply
      : null;
    const bubbleProps = this.getInnerComponentProps();
    // if (this.props.renderBubble) {
    //   return this.props.renderBubble(bubbleProps);
    // }
    return (
      <View styles={{marginBottom: 20}}>
        <Bubble {...bubbleProps} renderNewReply={renderNewReplyMethod} />
      </View>
    );
  }

  renderAvatar() {
    return <View />;
  }

  render() {
    console.log(
      '>>>>>>> render firing in slack message<<<<<<<',
      this.props.currentMessage.text
    );
    const marginBottom = 10;
    return (
      <View>
        {/* {this.renderDay()} */}
        <View
          style={[
            styles.container,
            {marginBottom},
            {
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignSelf: 'baseline',
              margin: 2
            },
            this.props.containerStyle
          ]}
        >
          {/* {this.renderAvatar()} */}
          {this.renderBubble()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 40,
    width: 40,
    borderRadius: 3
  }
});

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {}
};

Message.propTypes = {
  renderAvatar: PropTypes.func,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  })
};
