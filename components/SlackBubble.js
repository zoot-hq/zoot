import PropTypes from 'prop-types';
import React from 'react';
import { Text, Clipboard, StyleSheet, TouchableOpacity, View, ViewPropTypes, Platform, Image } from 'react-native';
import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';
import { Foundation } from '@expo/vector-icons';

import Fire from '../Fire';

const { isSameUser, isSameDay } = utils;

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
    this.state = {
      likes: this.props.currentMessage.likes || null,
      loves: this.props.currentMessage.loves || null,
      lightbulbs: this.props.currentMessage.lightbulbs || null
    } 
  }

  onLongPress() {
    const messageUsername = this.props.currentMessage.user.name
    const currentUsername = Fire.shared.username()
    const room = this.props.currentMessage.room
    
    if (this.props.currentMessage.text && (messageUsername != currentUsername) && this.props.currentMessage.text !=`Welcome to # ${room} - send a message to get the conversation started`) {
      const options = [
        this.state.likes.users[currentUsername] ? 'Unlike' : 'Like',
        this.state.loves.users[currentUsername] ? 'Unlove' : 'Love',
        this.state.lightbulbs.users[currentUsername] ? 'Unlightbulb' : 'Lightbulb',
        'Cancel'
      ];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            // Clipboard.setString(this.props.currentMessage.text);
            this.react('likes')
            break;
          case 1: 
            this.react('loves')
            break;
          case 2: 
            this.react('lightbulbs')
            break;
        }
      });
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [styles.standardFont, styles.slackMessageText, messageTextProps.textStyle, messageTextStyle],
          }}
        />
      );
    }
    return null;
  }

  renderMessageImage = () => {
    if (this.props.currentMessage.base64) {
      return  <Image
        source={{ uri: `data:image/png;base64,${this.props.currentMessage.base64}`}}
        style={{ height: 300, width: 300 }}
    />
    }
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderUsername = () => {
    const username = this.props.currentMessage.user.name;
    if (username) {
      return (
        <TouchableOpacity onLongPress={this.startPM}>
          <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
            {username}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
        />
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  react(reactionType) {
    const messageUsername = this.props.currentMessage.user.name
    const currUser = Fire.shared.username()

    // don't allow users to react on their own posts
    if (messageUsername === currUser) return

    const reaction = this.state[reactionType]

    // if user has not yet reacted, react
    if (!reaction.users[currUser]) {
      reaction.count ++
      reaction.users[currUser] = true
      this.setState({reaction})
      Fire.shared.react(this.props.currentMessage, reactionType, reaction.count)
    }

    // if user has reacted, remove reaction
    else {
      reaction.count --
      delete reaction.users[currUser]
      this.setState({reaction})
      Fire.shared.react(this.props.currentMessage, reactionType, reaction.count)
    }
  }

  startPM = async () => {
    const otherUsername = this.props.currentMessage.user.name
    const currentUsername = Fire.shared.username()

    if (otherUsername != currentUsername) {
      const comboName = otherUsername < currentUsername ? otherUsername + '-' + currentUsername : currentUsername + '-' + otherUsername
      await Fire.shared.createRoom(comboName, true)
      this.props.listViewProps.navigation.pop()
      this.props.listViewProps.navigation.navigate('ChatRoom', {comboName})
    }
  }

  renderReactions() {
    return(
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity style={{marginRight: 20}} onLongPress={() => this.react('likes')}><Foundation name='like' color='grey' size={20}><Text> {this.state.likes.count || null}</Text></Foundation></TouchableOpacity>
        <TouchableOpacity style={{marginRight: 20}} onLongPress={() => this.react('loves')}><Foundation name='heart' color='grey' size={20}><Text> {this.state.loves.count || null}</Text></Foundation></TouchableOpacity>
        <TouchableOpacity style={{marginRight: 20}} onLongPress={() => this.react('lightbulbs')}><Foundation name='lightbulb' color='grey' size={20}><Text> {this.state.lightbulbs.count || null}</Text></Foundation></TouchableOpacity>
      </View>
    )
  }

  render() {
    const messageHeader = (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
        {/* {this.renderTicks()} */}
      </View>
    );

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityTraits="text"
          {...this.props.touchableProps}
        >
          <View
            style={[
              styles.wrapper,
              this.props.wrapperStyle,
            ]}
          >
            <View>
              {/* {this.renderCustomView()} */}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}

              {/* render reactions on messages with the reaction feature */}
              {this.props.currentMessage.likes ? this.renderReactions() : null}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    fontSize: 15,
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
    fontFamily: "Futura-Light"
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  wrapper: {
    marginRight: 0,
    minHeight: 20,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
    fontFamily: "CormorantGaramond-Light"
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
    fontFamily: "CormorantGaramond-Light"
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
});

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};

Bubble.propTypes = {
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  messageTextStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  })
};