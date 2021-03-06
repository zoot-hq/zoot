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
  Alert,
  TextInput,
  Dimensions
} from 'react-native';
import {MessageText, Time, utils} from 'react-native-gifted-chat';
import {Feather, Foundation, MaterialIcons} from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';
import AllReplies from './AllReplies';
import * as firebase from 'firebase';
import moment from 'moment';

import Fire from '../Fire';

const {isSameUser, isSameDay} = utils;

let messageViewWidth;

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
      indent: 0,
      newReply: false,
      replyInput: '',
      showReplies: true,
      deleted: false
    };
  }

  async componentWillMount() {
    let replies = await this.getReplies(this.props.currentMessage._id);
    await this.setState({replies: replies});
  }

  onLongPress() {
    // const messageUsername = this.props.currentMessage.user.name
    // const currentUserId = Fire.shared.username()
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
          <Text style={styles.slackMessageTextFlagged}>
            This message has been flagged by a user as abusive. Longpress here
            to view this message which may contain objectionable content at your
            own volition and risk.{' '}
          </Text>
        </TouchableOpacity>
      );
    }
    if (this.props.currentMessage.deleted || this.state.deleted) {
      return (
        <Text style={styles.deletedMessage}>
          The user has deleted this message.
        </Text>
      );
    } else if (this.props.currentMessage.text) {
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
        // <MessageText
        //   {...messageTextProps}
        //   textStyle={{
        //     left: [
        //       styles.standardFont,
        //       styles.slackMessageText,
        //       messageTextProps.textStyle,
        //       messageTextStyle,
        //       styles.testingYellow
        //     ]
        //   }}
        // />
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.username}>
            {this.props.currentMessage.user.name}
            {this.props.currentMessage.mention}{' '}
            <Text style={styles.slackMessageText}>
              {this.props.currentMessage.text}
            </Text>
          </Text>
        </View>
      );
    }
    return null;
  };

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

  renderStar = () => {
    const username = this.props.currentMessage.user.name;
    if (username) {
      return (
        <TouchableOpacity onLongPress={this.startPM}>
          <Text
            style={[
              styles.standardFont,
              styles.headerItem,
              // this.props.usernameStyle,
              styles.username
            ]}
          >
            STARRRRR
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  renderUsername = () => {
    const username = this.props.currentMessage.user.name;
    if (username) {
      return (
        <TouchableOpacity onLongPress={this.startPM}>
          <Text
            style={[
              styles.standardFont,
              styles.headerItem,
              // this.props.usernameStyle,
              styles.username
            ]}
          >
            {username}:
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  // renderTime() {
  //   if (this.props.currentMessage.createdAt) {
  //     const {containerStyle, wrapperStyle, ...timeProps} = this.props;
  //     if (this.props.renderTime) {
  //       return this.props.renderTime(timeProps);
  //     }
  //     return (
  //       <Time
  //         {...timeProps}
  //         containerStyle={{left: [styles.timeContainer]}}
  //         textStyle={{
  //           left: [
  //             styles.standardFont,
  //             styles.headerItem,
  //             styles.time,
  //             timeProps.textStyle
  //           ]
  //         }}
  //       />
  //     );
  //   }
  //   return null;
  // }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  getRoomType() {
    const roomType = this.props.listViewProps.navigation.state.params.live
      ? 'livechatrooms'
      : this.props.listViewProps.navigation.state.params.PM
      ? 'PMrooms'
      : 'chatrooms';
    return roomType;
  }

  react(reactionType) {
    const currUser = Fire.shared.username();
    const roomType = this.getRoomType();

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
        reaction.count,
        roomType
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
    const otherUserId = this.props.currentMessage.user._id;
    const currentUserId = Fire.shared.uid();
    return otherUserId === currentUserId;
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
      recipients: ['info@apres.chat'],
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
      `You are about to flag this message as objectionable. Flagging the message will simply hide the message
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
        <View style={{display: 'flex', flexDirection: 'row', marginBottom: 15}}>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('likes')}
          >
            <Foundation
              name="like"
              color={this.state.likes.count > 0 ? '#595959' : 'lightgray'}
              size={15}
            >
              <Text style={styles.count}>
                {' '}
                {this.state.likes.count || null}
              </Text>
            </Foundation>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('loves')}
          >
            <Foundation
              name="heart"
              color={this.state.loves.count > 0 ? '#595959' : 'lightgray'}
              size={15}
            >
              <Text style={styles.count}>
                {' '}
                {this.state.loves.count || null}
              </Text>
            </Foundation>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.react('lightbulbs')}
          >
            <Foundation
              name="lightbulb"
              color={this.state.lightbulbs.count > 0 ? '#595959' : 'lightgray'}
              size={15}
            >
              <Text style={styles.count}>
                {' '}
                {this.state.lightbulbs.count || null}
              </Text>
            </Foundation>
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginRight: 20}}
            onLongPress={() => this.flag()}
          >
            <Foundation
              name="flag"
              color={this.state.flags.count > 0 ? '#595959' : 'lightgray'}
              size={15}
            >
              <Text style={styles.count}>
                {' '}
                {this.state.flags.count || null}
              </Text>
            </Foundation>
          </TouchableOpacity>

          {this.renderBlock()}
          {this.isSameUser() && (
            <TouchableOpacity
              style={{marginRight: 20}}
              onLongPress={() => this.deleteMessage()}
            >
              <Feather name="trash-2" color="lightgray" size={15} />
            </TouchableOpacity>
          )}

          {/* replies can only have one level; you cannot reply to replies */}
          <TouchableOpacity
            style={{marginRight: 20}}
            onPress={() => this.setState({newReply: true})}
          >
            <Feather name="corner-right-down" color="lightgrey" size={15} />
          </TouchableOpacity>

          {this.renderDisplayReplies()}
        </View>
      );
  };

  renderBlock() {
    const messageUserId = this.props.currentMessage.user._id;
    const currUser = Fire.shared.uid();
    if (this.state.react && messageUserId != currUser) {
      return (
        <TouchableOpacity onPress={this.blockPopup}>
          <MaterialIcons
            name="block"
            size={15}
            color={'lightgrey'}
            style={{marginRight: 20}}
          ></MaterialIcons>
        </TouchableOpacity>
      );
    }
  }

  async deleteMessage() {
    const roomType = this.getRoomType();
    const roomRef = await firebase
      .database()
      .ref(roomType)
      .child(this.props.currentMessage.room);
    // if message is a reply, change deleted to 'true' in 'replies' of parent
    if (this.props.currentMessage.isReply) {
      await roomRef
        .child(this.props.currentMessage.parentId)
        .child('replies')
        .child(this.props.currentMessage._id)
        .update({deleted: true, react: false});
    }
    // else change deleted to true in root level message/duplicate
    else {
      await roomRef
        .child(this.props.currentMessage._id)
        .update({deleted: true, react: false});
    }
    this.setState({deleted: true});
  }

  renderReplies() {
    if (this.state.replies.length && this.state.showReplies) {
      return (
        <View>
          <AllReplies
            {...this.props}
            // parentIndent indents the reply +10 spaces from its parent message
            parentIndent={this.state.indent}
            replies={this.state.replies}
          />
        </View>
      );
    }
  }

  renderDisplayReplies() {
    if (this.state.replies.length) {
      return (
        <View>
          {this.state.showReplies ? (
            <TouchableOpacity
              onPress={() => this.setState({showReplies: false})}
            >
              <Text style={styles.replyButton}>Hide replies</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.setState({showReplies: true})}
            >
              <Text style={styles.replyButton}>Show replies</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  }

  async getReplies(parentId) {
    const roomType = this.getRoomType();
    const ref = await firebase
      .database()
      .ref(roomType)
      .child(this.props.currentMessage.room)
      .child(parentId);
    let replies = await ref
      .child('replies')
      .once('value')
      .then(function (snapshot) {
        return snapshot;
      });
    if (replies) {
      // put the replies in an array so we can map through them
      let keyArr = [];
      for (let key in replies) {
        keyArr.push(key);
      }
      // deconstruct the reply from the object it's nested in
      let repliesObj = replies.val();
      let repliesArr = [];
      for (let reply in repliesObj) {
        // make the id a property on the reply object as well as its key to make the data more accessible (is this still necessary?)
        repliesObj[reply]._id = reply;
        repliesArr.push(repliesObj[reply]);
      }
      return repliesArr;
    } else {
      return [];
    }
  }
  submitReply = async () => {
    // send the reply to db
    await this.sendReply();
    // then remove the input box from render (since we're finished with it)
    this.setState({newReply: false});
    if (!this.props.currentMessage.isReply) {
      // get all the replies from the database including the recently added reply
      let replies = await this.getReplies(this.props.currentMessage._id);
      // put all the retrieved replies on the state to display them
      await this.setState({replies: replies});
    } else {
      const newestReplies = await this.getReplies(
        this.props.currentMessage.parentId
      );
      this.props.renderNewReply(newestReplies[newestReplies.length - 1]);
    }
  };
  sendReply = async () => {
    let mentionedUser = '';
    let parentId = this.props.currentMessage._id;
    if (this.props.currentMessage.isReply) {
      // include the name of the user to mention
      mentionedUser = ' @' + this.props.currentMessage.user.name;
      // and make sure it gets added as a child of this message's parent (so they're in the same thread, not nested at a new level)
      parentId = this.props.currentMessage.parentId;
    }
    // format message to go to Fire.shared.send()
    const message = {
      text: this.state.replyInput,
      mention: mentionedUser,
      user: {name: Fire.shared.username(), _id: Fire.shared.uid()}
    };
    const roomType = this.getRoomType();
    // pm and live are false, reply is true, parentId is used to identify which message to add it to in the DB
    await Fire.shared.sendReply(
      message,
      this.props.currentMessage.room,
      roomType,
      parentId
    );
  };

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
    // const messageHeader = (
    //   <View style={styles.headerView}>
    //     {/* {this.renderUsername()} */}
    //     {/* {this.renderTime()} */}
    //     {/* {this.renderBlock()} */}
    //     {/* {this.renderTicks()} */}
    //   </View>
    // );

    const win = Dimensions.get('window');

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityTraits="text"
          {...this.props.touchableProps}
        >
          {/* Indented Chatstyle
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <View>
              <View
                onLayout={(event) => {
                  messageViewWidth = event.nativeEvent.layout.width;
                }}
                style={[
                  this.props.currentMessage.isReply
                    ? {
                      maxWidth: 200,
                      flexDirection: 'row'
                    }
                    : { maxWidth: 300, flexDirection: 'row' }
                ]}
              > */}

          <View>
            <View>
              {/* {this.renderCustomView()} */}
              <View
                onLayout={(event) => {
                  messageViewWidth = event.nativeEvent.layout.width;
                }}
                // style={[
                //   this.props.currentMessage.isReply
                //     ? {
                //         // maxWidth: win.width,
                //         flexDirection: 'row', // F
                //         flexWrap: 'wrap',
                //         flex: 1
                //         // alignContent: 'flex-start',
                //         // maxWidth: win.width,
                //         // alignSelf: 'baseline',
                //         // borderColor: 'blue',
                //         // borderStyle: 'dashed',
                //         // borderWidth: 2,
                //       }
                //     : {
                //         flex: 1,
                //         // maxWidth: win.width,
                //         flexDirection: 'row', // F
                //         flexWrap: 'wrap'
                //         // alignContent: 'flex-start',
                //         // alignSelf: 'baseline',
                //         // borderColor: 'blue',
                //         // borderStyle: 'solid',
                //         // borderWidth: 2,
                //       }
                // ]}
              >
                {/* {this.renderUsername()} */}
                {/* render time next to username in PMs and live chat: */}
                {this.props.currentMessage.user._id &&
                  (this.props.listViewProps.navigation.state.params.live ||
                    this.props.listViewProps.navigation.state.params.PM) && (
                    <View style={styles.timestamp}>
                      <Text style={styles.username}>
                        (
                        {moment(this.props.currentMessage.timestamp).format(
                          'hh:mm a'
                        )}
                        )
                      </Text>
                    </View>
                  )}
                {/* {this.renderMessageImage()} */}
                {this.renderMessageText()}
              </View>

              {/* render reactions on messages with the reaction feature */}
              {this.renderReactions()}
              {this.renderReplies()}
              {/* this.state.newReply becomes true when a user clicks the reply button */}
              {this.state.newReply && (
                <View>
                  <View>
                    {this.props.currentMessage.isReply && (
                      <Text style={styles.username}>
                        @{this.props.currentMessage.user.name}:
                      </Text>
                    )}
                    <TextInput
                      returnKeyType="done"
                      placeholder="Type your reply"
                      placeholderTextColor="#bfbfbf"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.input}
                      onChangeText={(replyInput) => this.setState({replyInput})}
                    />
                    <View style={styles.replyInputContainer}>
                      <TouchableOpacity
                        onPress={() => this.setState({newReply: false})}
                      >
                        <Text style={styles.replyButton}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.submitReply}>
                        <Text style={styles.replyButton}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const win = Dimensions.get('window');

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  count: {
    fontSize: 12,
    fontFamily: 'Futura-Light',
    paddingBottom: 2
  },
  standardFont: {
    fontSize: 16
  },
  // messageContainer: {
  //   flexDirection: 'row',
  //   maxWidth: messageViewWidth
  // },
  username: {
    fontFamily: 'Futura-Medium',
    // height: 20,
    // marginTop: 2,
    // borderColor: 'hotpink',
    // borderWidth: 2,
    alignSelf: 'baseline',
    // flexDirection: 'row', // F
    flexWrap: 'wrap',
    alignItems: 'flex-start'
    // fontWeight: "900",
  },
  // username: {
  //   // fontWeight: 'bold',
  //   fontWeight: '300',
  //   fontFamily: 'CormorantGaramond-Light'
  // },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
    fontFamily: 'Futura-Light',
    color: 'black',
    flexWrap: 'wrap'
  },
  testingYellow: {
    flexWrap: 'wrap',
    flex: 1,
    // maxWidth: win.width - 20,
    alignSelf: 'baseline',
    // flexShrink: 1,
    overflow: 'hidden'
    // borderColor: 'yellow',
    // borderStyle: 'solid',
    // borderWidth: 2,
    // margin: 0,
  },
  slackMessageTextFlagged: {
    marginLeft: 0,
    marginRight: 0,
    fontFamily: 'Futura-Light',
    color: 'gray'
  },
  deletedMessage: {
    fontFamily: 'Futura-Light',
    color: 'gray',
    alignSelf: 'flex-end'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  },
  // wrapper: {

  //   marginRight: 0,
  //   minHeight: 20,
  //   alignSelf: 'stretch',
  //   justifyContent: 'flex-end',
  //   maxWidth: win.width,
  //   flexWrap: 'wrap',
  //   borderColor: 'orange',
  //   flexShrink: 1,
  //   borderStyle: 'solid',
  //   borderWidth: 2,
  //   alignSelf: 'baseline',
  // },
  time: {
    textAlign: 'left',
    fontSize: 12,
    fontFamily: 'CormorantGaramond-Light',
    color: '#595959'
  },
  timestamp: {
    flexDirection: 'row',
    marginRight: 10
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
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    borderLeftWidth: 0.5,
    borderLeftColor: 'gray',
    borderRightWidth: 0.5,
    borderRightColor: 'gray',
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    flexGrow: 1,
    textAlignVertical: 'bottom',
    marginLeft: 15,
    marginRight: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    minHeight: 30,
    width: 200
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  replyButton: {
    fontFamily: 'CormorantGaramond-Light',
    color: 'gray'
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
