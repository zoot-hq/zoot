import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
  Image,
  Alert
} from 'react-native';
import {MessageText, Time, utils} from 'react-native-gifted-chat';
import {Foundation, MaterialIcons} from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import AllReplies from './AllReplies';

import Fire from '../Fire';

const {isSameUser, isSameDay} = utils;

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
    this.state = {
      likes: this.props.currentMessage.likes || null,
      loves: this.props.currentMessage.loves || null,
      lightbulbs: this.props.currentMessage.lightbulbs || null,
      flags: this.props.currentMessage.flags || null,
      react: this.props.currentMessage.react,
      hidden: this.props.currentMessage.hidden,
      addFriend: this.props.currentMessage.addFriend || null,
      replies: [],
      indent: 0
    };
  }

  onLongPress() {
    // const messageUsername = this.props.currentMessage.user.name
    // const currentUsername = Fire.shared.username()
    // const room = this.props.currentMessage.room
    // if (this.props.currentMessage.text && (messageUsername != currentUsername) && this.props.currentMessage.react){
    //   const options = [
    //     this.state.likes.users[currentUsername] ? 'Unlike' : 'Like',
    //     this.state.loves.users[currentUsername] ? 'Unlove' : 'Love',
    //     this.state.lightbulbs.users[currentUsername] ? 'Unlightbulb' : 'Lightbulb',
    //     this.state.flags.users[currentUsername] ? 'Unflag' : 'Flag',
    //     'Cancel'
    //   ];
    //   const cancelButtonIndex = options.length - 1;
    //   this.context.actionSheet().showActionSheetWithOptions({
    //     options,
    //     cancelButtonIndex,
    //   },
    //   (buttonIndex) => {
    //     switch (buttonIndex) {
    //       case 0:
    //         // Clipboard.setString(this.props.currentMessage.text);
    //         this.react('likes')
    //         break;
    //       case 1:
    //         this.react('loves')
    //         break;
    //       case 2:
    //         this.react('lightbulbs')
    //         break;
    //       case 3:
    //           this.react('flags')
    //           break;
    //     }
    //   });
    // }
  }

  unhideMessage = () => {
    this.setState({
      hidden: false,
      react: true
    });
  };

  renderMessageText = () => {
    // check if message should be hidden
    if (this.state.hidden && !this.isSameUser()) {
      return (
        <TouchableOpacity onLongPress={() => this.unhideMessage()}>
          <Text style={styles.slackMessageText}>
            This message has been flagged by a user as abusive. Longpress here
            to view this message which may contain objectionable content at your
            own volition and risk.{' '}
          </Text>
        </TouchableOpacity>
      );
    }
    if (this.props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        ...messageTextProps
      } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <TouchableOpacity
          // results in a cycle
          onPress={() => this.addReply()}
        >
          <MessageText
            {...messageTextProps}
            textStyle={{
              left: [
                styles.standardFont,
                styles.slackMessageText,
                messageTextProps.textStyle,
                messageTextStyle
              ]
            }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  addReply() {
    let currentIndent = this.state.indent;
    let newIndent = currentIndent + 10;
    const addNewReply = this.state.replies.concat(newIndent);
    this.setState({replies: addNewReply});
    this.setState({indent: newIndent});
    // the props should be specific to this message
    // may have to create whole new component to contain AllReplies, then another component to contain SingleReply
    // pass this message's id to AllReplies
    // AllReplies' state has an array with each individual reply
    // when a user clicks this message, a nested component renders in the space below, with a margin of thisMargin + 10.
  }
  renderMessageImage = () => {
    if (this.props.currentMessage.base64) {
      return (
        <Image
          source={{
            uri: `data:image/png;base64,${this.props.currentMessage.base64}`
          }}
          style={{height: 300, width: 300}}
        />
      );
    }
  };

  renderTicks() {
    const {currentMessage} = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && (
            <Text
              style={[styles.standardFont, styles.tick, this.props.tickStyle]}
            >
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[styles.standardFont, styles.tick, this.props.tickStyle]}
            >
              ✓
            </Text>
          )}
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
          <Text
            style={[
              styles.standardFont,
              styles.headerItem,
              styles.username,
              this.props.usernameStyle
            ]}
          >
            {username}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const {containerStyle, wrapperStyle, ...timeProps} = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{left: [styles.timeContainer]}}
          textStyle={{
            left: [
              styles.standardFont,
              styles.headerItem,
              styles.time,
              timeProps.textStyle
            ]
          }}
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
    const currUser = Fire.shared.username();

    // don't allow users to react on their own posts
    if (this.isSameUser()) return;

    const reaction = this.state[reactionType];

    // if user has not yet reacted, react
    if (!reaction.users[currUser]) {
      reaction.count++;
      reaction.users[currUser] = true;
      this.setState({reaction});
      Fire.shared.react(
        this.props.currentMessage,
        reactionType,
        reaction.count
      );
    }

    // if user has reacted, remove reaction
    else if (reactionType != 'flags') {
      reaction.count--;
      delete reaction.users[currUser];
      this.setState({reaction});
      Fire.shared.react(
        this.props.currentMessage,
        reactionType,
        reaction.count
      );
    }
  }

  isSameUser = () => {
    const otherUsername = this.props.currentMessage.user.name;
    const currentUsername = Fire.shared.username();
    return otherUsername === currentUsername;
  };

  startPM = () => {
    const otherUsername = this.props.currentMessage.user.name;
    const currentUsername = Fire.shared.username();

    if (!this.isSameUser()) {
      const comboName =
        otherUsername < currentUsername
          ? otherUsername + '-' + currentUsername
          : currentUsername + '-' + otherUsername;
      Fire.shared.createPMRoom(comboName, (status) => {
        if (status === 'user blocked') {
          console.log('user blocked');
          Alert.alert(
            'Error',
            `${this.props.currentMessage.user.name} is not available for private messaging.`
          );
        } else {
          // navigate to pm
          this.props.listViewProps.navigation.replace('ChatRoom', {
            chatroom: comboName,
            PM: true
          });
        }
      });
    }
  };

  contactAdmin = async () => {
    const message = this.props.currentMessage;
    const messageName = this.props.currentMessage._id;
    const options = {
      recipients: ['aprshq@gmail.com'],
      subject: 'Objectionable Content',
      body: `The following message was marked as objectionable:

      ${message.user.name} in #${message.room}: ${
        message.text
      } [Message ID: ${messageName}]
      --- reported by: ${Fire.shared.username()}`
    };
    try {
      await MailComposer.composeAsync(options);
    } catch (error) {
      if (error.message === 'Mail services are not available.') {
        Alert.alert(
          'Contact Administrators',
          'We were unable to open up your mail app. Please contact our admins directly at aprshq@gmail.com if you think this message should be removed. In your email, please include the thread it was sent in, the username of the message, date and time it was sent, and the message text itself. Thank you for helping us keep our content safe. '
        );
      }
    }

    this.react('flags');
  };

  flag = () => {
    if (this.isSameUser()) return;
    Alert.alert(
      'Flag Message',
      `You are about to flag this message as objectionable. Flagging the message will simple hide the message
      from public view. To have the message removed, please choose the Contact Administrators option.`,
      [
        {text: 'Cancel', onPress: () => false},
        {text: 'Flag Message', onPress: () => this.react('flags')},
        {text: 'Contact Administrators', onPress: () => this.contactAdmin()}
      ],
      {cancelable: false}
    );
  };

  renderReactions = () => {
    if (this.state.react || this.isSameUser())
      return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('likes')}
          >
            <Foundation name="like" color="grey" size={20}>
              <Text> {this.state.likes.count || null}</Text>
            </Foundation>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('loves')}
          >
            <Foundation name="heart" color="grey" size={20}>
              <Text> {this.state.loves.count || null}</Text>
            </Foundation>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('addFriend')}
          >
            <Foundation name="person_add" color="grey" size={20}>
              <Text> Add friend </Text>
            </Foundation>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('lightbulbs')}
          >
            <Foundation name="lightbulb" color="grey" size={20}>
              <Text> {this.state.lightbulbs.count || null}</Text>
            </Foundation>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.flag()}
          >
            <Foundation name="flag" color="grey" size={20}>
              <Text> {this.state.flags.count || null}</Text>
            </Foundation>
          </TouchableOpacity>
        </View>
      );
  };

  renderBlock() {
    const messageUsername = this.props.currentMessage.user.name;
    const currUser = Fire.shared.username();
    if (this.state.react && messageUsername != currUser) {
      return (
        <TouchableOpacity onPress={this.blockPopup}>
          <MaterialIcons name="block" size={15}></MaterialIcons>
        </TouchableOpacity>
      );
    }
  }

  blockPopup = () => {
    const user = this.props.currentMessage.user.name;
    Alert.alert(
      'Block User',
      `Are you sure you would like to block ${user}? This user will no longer be able to contact you. This action cannot be undone. `,
      [
        {text: 'No', onPress: () => false},
        {text: 'Yes', onPress: () => this.blockUser()}
      ],
      {cancelable: false}
    );
  };

  successBlock = () => {
    const blockedUser = this.props.currentMessage.user.name;
    Alert.alert(
      'User blocked',
      `${blockedUser} has been successfully blocked.`,
      [{text: 'OK', onPress: () => true}],
      {cancelable: false}
    );
  };

  blockUser = () => {
    Fire.shared.blockUser(this.props.currentMessage.user.name);
    this.successBlock();
  };

  render() {
    const messageHeader = (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
        {this.renderBlock()}
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
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <View>
              {/* {this.renderCustomView()} */}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}

              {/* render reactions on messages with the reaction feature */}
              {this.renderReactions()}
            </View>
          </View>
        </TouchableOpacity>
        {this.state.replies.length ? (
          <AllReplies
            {...this.props}
            parentIndent={this.state.indent}
            replies={this.state.replies}
          />
        ) : null}
      </View>
    );
  }
}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    fontSize: 15
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
    fontFamily: 'Futura-Light'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  },
  wrapper: {
    marginRight: 0,
    minHeight: 20,
    alignSelf: 'stretch',
    justifyContent: 'flex-end'
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'CormorantGaramond-Light'
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
    fontFamily: 'CormorantGaramond-Light'
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  headerItem: {
    marginRight: 10
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: 'transparent',
    color: 'white'
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row'
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0
  }
});

Bubble.contextTypes = {
  actionSheet: PropTypes.func
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
    image: null
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {}
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
    right: ViewPropTypes.style
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  messageTextStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  })
};
