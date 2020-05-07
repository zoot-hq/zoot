import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { MaterialIndicator } from 'react-native-indicators';
import SlackMessage from './SlackMessage';
import Fire from '../Fire';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';

import BackIcon from '../assets/icons/BackIcon';
import HelpIcon from '../assets/icons/HelpIcon';

import BackButton from './BackButton';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: this.props.navigation.state.params.chatroom,
      pm: this.props.navigation.state.params.PM,
      live: this.props.navigation.state.params.live,
      messages: [],
      user: {
        name: Fire.shared.username(),
        _id: Fire.shared.uid()
      },
      loadEarlier: true
    };
  }

  componentDidMount = () => {
    // help icon
    this.helpAlert = () => {
      if (this.state.pm) {

        Alert.alert(
          'Help',
          'Welcome to the message boards. \n\nReact and reply to posts by longpressing icons beneath messages.\nPress the flag icon to flag abusive messages, and press the block icon to block abusive users.\n\nPress the back button in the top left or swipe right to return to the home screen.',
          [{ text: 'Got it!' }]
        );

      }
      if (this.state.live) {

        Alert.alert(
          'Help',
          'Welcome to live chat. \n\nReact to posts by longpressing icons beneath messages.\n\nPress the flag icon to flag abusive messages, and press the block icon to block abusive users.\n\nSwipe right to return to the home screen.',
          [{ text: 'Got it!' }]
        );

      } else {

        Alert.alert(
          'Help',
          'Welcome to the message boards. \n\nReact and reply to posts by longpressing icons beneath messages.\nPress the flag icon to flag abusive messages, and press the block icon to block abusive users.\n\nPress the back button in the top left or swipe right to return to the home screen.',
          [{ text: 'Got it!' }]
        );

      }
    };


    // back alet
    this.back = () => {
      Alert.alert(
        'Back button coming soon!',
        'The back button is in the works. Hang tight!',
        [{ text: 'OK!' }]
      );
    };

    //get messages for chatroom
    Fire.shared.on(
      this.state.room,
      this.state.pm,
      this.state.live,
      (message) => {
        if (message.user) {
          this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, message)
          }));
        }
      }
    );

    // set timeout for enter message
    setTimeout(() => {
      Fire.shared.enterRoom(this.state.room, this.state.pm, this.state.live);
    }, 1500);

    // set event listener for a user exit
    AppState.addEventListener('change', this.handleAppStateChange);

    // set error handler to ensure leave room event on app crash
    const defaultErrorHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((e, isFatal) => {
      Fire.shared.leaveRoom(this.state.room, this.state.pm, this.state.live);
      defaultErrorHandler(e, isFatal);
    });

    // set timer for chat end
    if (this.state.live) {
      this.intervalID = setInterval(() => {
        // get nyc time
        const currTime = new Date();
        const currNyTime = this.changeTimezone(currTime, 'America/New_York');

        // if time is outside set time for live chat
        if (
          !(
            currNyTime.getDay() === 3 &&
            (currNyTime.getHours() === 21 ||
              (currNyTime.getHours() === 22 && currNyTime.getMinutes() < 30))
          )
        )
          Alert.alert(
            'This live chat has ended',
            'We welcome you to join us again next week!',
            [
              {
                text: 'See you next time!',
                onPress: () => this.props.navigation.replace('CategoryList')
              }
            ]
          );
      }, 30000);
    }
  };

  changeTimezone = (date, ianatz) => {
    const invdate = new Date(
      date.toLocaleString('en-US', {
        timeZone: ianatz
      })
    );
    const diff = date.getTime() - invdate.getTime();
    return new Date(date.getTime() + diff);
  };

  handleAppStateChange = () => {
    if (AppState.currentState.match(/inactive/)) {
      Fire.shared.leaveRoom(this.state.room, this.state.pm, this.state.live);
    } else if (AppState.currentState.match(/active/)) {
      Fire.shared.enterRoom(this.state.room, this.state.pm, this.state.live);
    }
  };

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this.handleAppStateChange);
    Fire.shared.leaveRoom(this.state.room, this.state.pm, this.state.live);
    Fire.shared.off();
    clearInterval(this.intervalID);
  };

  renderMessage(props) {
    const {
      currentMessage: { text: currText }
    } = props;

    let messageTextStyle;
    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />;
  }

  // load earlier messages from backend
  loadEarlier = async () => {
    this.setState({ isLoading: true });

    const newMessages = [];

    for (let i = 0; i < 10; i++) {
      await Fire.shared.loadEarlier(
        this.state.room,
        this.state.messages[this.state.messages.length - 1],
        this.state.pm,
        this.state.live,
        (message) => {
          newMessages.push(message);
        }
      );

      this.setState((previousState) => ({
        messages: GiftedChat.prepend(previousState.messages, newMessages.pop())
      }));
    }

    this.setState({ isLoading: false });
  };

  // returns true if a user has scrolled to the top of all messages, false otherwise
  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  }

  uploadImage = async () => {
    // get permission to access camera roll
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // grab picture
    const image = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0
    });

    // send to database
    if (image) {
      Fire.shared.sendImage(image, this.state.room);
    }
  };

  // renderChatFooter = () => {
  //   return (
  //     <TouchableOpacity style={styles.chatFooter} onPress={() => this.uploadImage()}>
  //       <MaterialIcons name='photo' color='grey' size={30}></MaterialIcons>
  //     </TouchableOpacity>
  //   )
  // }

  render() {
    //conditional rendering for each different type of chatroom
    //once we add categories, we need to modify the chatrooms to say
    //Welcome to the #{this.state.room} message board located within CATEGORY NAME/PARTNER NAME
    renderHeaderText = () => {
      if (this.state.pm) {
        return (
          <Text>
            Welcome to your personal messages in #{this.state.room}. Happy
            chatting!
          </Text>
        );
      }
      if (this.state.live) {
        return (
          <Text>
            Welcome to the #{this.state.room} message board. Once this live chat
            ends, it will no longer be available.
          </Text>
        );
      } else {
        return (
          <Text>
            Welcome to the #{this.state.room} message board. Get started by
            posting a tip or asking a question.
          </Text>
        );
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.innerView}>
          {/* back button */}
          <View style={styles.help}>
            <BackButton navigation={this.props.navigation} />

            {/* help button */}
            <TouchableOpacity onPress={() => this.helpAlert()}>
              <HelpIcon />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginBottom: 40 }}>
            <Text style={styles.subtitle2}>#{this.state.room}</Text>
            <Text style={styles.subtitle}>{renderHeaderText()}</Text>
            <GiftedChat
              messages={this.state.messages}
              listViewProps={{
                scrollEventThrottle: 400,
                onScroll: ({ nativeEvent }) => {
                  if (this.isCloseToTop(nativeEvent) && !this.state.isLoading) {
                    this.setState({ isLoading: true });
                    this.loadEarlier();
                  }
                },
                navigation: this.props.navigation
              }}
              onSend={(messages) =>
                Fire.shared.send(
                  messages,
                  this.state.room,
                  this.state.pm,
                  this.state.live
                )
              }
              user={this.state.user}
              renderMessage={this.renderMessage}
              renderAvatar={null}
              sendImage={this.sendImage}
              renderLoading={() => <MaterialIndicator color="black" />}
            // renderChatFooter={this.renderChatFooter}
            />
          </View>
        </View>
      </View>
    );
  }
}

const win = Dimensions.get('window');

const styles = StyleSheet.create({
  help: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: -30,
    marginBottom: 20,
    height: 20,
    zIndex: 999,
    marginRight: 20,
    marginLeft: 20
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: win.width,
    borderColor: 'aqua',
    paddingTop: 20
  },
  title: {
    top: 10,
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
    paddingBottom: 5,
    fontFamily: 'CormorantGaramond-Light',
    backgroundColor: 'white',
    zIndex: 1
  },
  subtitle2: {
    fontSize: 40,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 15,
    fontFamily: 'CormorantGaramond-Light',
    marginTop: -15
  },
  tips: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 5,
    fontFamily: 'Futura-Light',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Futura-Light',
    marginTop: 2
  },
  chatFooter: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  innerView: {
    marginTop: 50,
    marginLeft: 3,
    marginRight: 3,
    flex: 1
  }
});
