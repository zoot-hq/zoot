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
import {GiftedChat} from 'react-native-gifted-chat';
import {MaterialIndicator} from 'react-native-indicators';
import SlackMessage from './SlackMessage';
import Fire from '../Fire';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons, Feather, AntDesign} from '@expo/vector-icons';

import BackIcon from '../assets/icons/BackIcon';
import HelpIcon from '../assets/icons/HelpIcon';

import BackButton from './BackButton';
import AllReplies from './AllReplies';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootMessage: {},
      replies: []
    };
  }
  renderMessage(props) {
    const {
      currentMessage: {text: currText}
    } = props;

    let messageTextStyle;
    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />;
  }
  // // returns true if a user has scrolled to the top of all messages, false otherwise
  // isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
  //   const paddingToTop = 80;
  //   return (
  //     contentSize.height - layoutMeasurement.height - paddingToTop <=
  //     contentOffset.y
  //   );
  // }
  componentDidMount = () => {
    // get the root message from props and set it to state
    this.setState({
      rootMessage: this.props.navigation.state.params.rootMessage,
      replies: this.props.navigation.state.params.replies
    });
    // get the replies and set them to state
  };

  render() {
    console.log(
      'thread screen render method line 40 root message ',
      this.state.rootMessage
    );
    return (
      <View style={styles.container}>
        <View style={styles.innerView}>
          {/* back button */}
          <View style={styles.help}>
            <BackButton navigation={this.props.navigation} />
          </View>

          <View style={{flex: 1, marginBottom: 40}}>
            <Text style={styles.subtitle2}>Message Thread Screen</Text>
            <Text style={styles.subtitle}>subtitle</Text>
            <GiftedChat
              messages={[this.state.rootMessage]}
              listViewProps={{
                scrollEventThrottle: 400,
                // onScroll: ({nativeEvent}) => {
                //   if (this.isCloseToTop(nativeEvent) && !this.state.isLoading) {
                //     this.setState({isLoading: true});
                //     this.loadEarlier();
                //   }
                // },
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
              // sendImage={this.sendImage}
              renderLoading={() => <MaterialIndicator color="black" />}
              // renderChatFooter={this.renderChatFooter}
            />
            {/* <GiftedChat
              messages={this.state.replies}
              listViewProps={{
                scrollEventThrottle: 400,
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
              renderMessage={this.renderMessage}
              user={this.state.user}
              renderAvatar={null}
              renderLoading={() => <MaterialIndicator color="black" />}
            /> */}
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
