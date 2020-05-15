import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native';
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import Fire from '../Fire';
import { withNavigation } from 'react-navigation';
import Svg, { Circle, Rect } from 'react-native-svg';

import HomeIcon from '../assets/icons/HomeIcon.js';

import UserIcon from '../assets/icons/UserIcon.js';

import InboxIcon from '../assets/icons/InboxIcon.js';

import LiveIcon from '../assets/icons/LiveIcon.js';

import PartnerIcon from '../assets/icons/PartnerIcon.js';

import ResourceIcon from '../assets/icons/ResourceIcon.js';

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      navbar: true,
      liveChatAvailable: false,
      numUnreadMessages: 0
    };
  }

  componentDidMount = () => {
    this.getLiveChatAvailability();
    this.getNumUnreadMessages();

    setInterval(() => {
      this.getLiveChatAvailability();
      this.getNumUnreadMessages();
    }, 15000);
  };

  getNumUnreadMessages = () => {
    Fire.shared.getNumUnreadMessages((num) => {
      this.setState({ numUnreadMessages: +num });
    });
  };

  communityPopup = (timeToAcceptableFirebaseString) => {
    Alert.alert(
      'Before you enter, here is a reminder of our Community Guidelines',
      `1. Après is intended to be a place of
        acceptance, empathy and compassion Above
        all else, try to be kind.
        2. Think before you type.
        3. If you see something unacceptable, please flag the comment for review.
        4. If you experience a user who repeatedly behaves in an unacceptable manner, please flag the user for review.
        5. If you are struggling in a way that feels overwhelming, please see our resources for access to professional mental healthcare providers, and get help.
        6. We are open and love your feedback. Please send us your suggestions on how to improve your experience.`,
      [
        {
          text: 'OK',
          onPress: () =>
            this.props.navigation.navigate('ChatRoom', {
              chatroom: timeToAcceptableFirebaseString,
              live: true
            })
        }
      ]
    );
  };

  getLiveChatAvailability = () => {
    // get nyc time
    const currTime = new Date();
    const currNyTime = this.changeTimezone(currTime, 'America/New_York');

    // if time is inside set time for live chat, set state to true
    if (
      currNyTime.getDay() === 3 &&
      (currNyTime.getHours() === 21 ||
        (currNyTime.getHours() === 22 && currNyTime.getMinutes() < 30))
    )
      this.setState({ liveChatAvailable: true });
  };

  liveChat = () => {
    // get nyc time
    const currTime = new Date();
    const currNyTime = this.changeTimezone(currTime, 'America/New_York');
    const liveChatTime = {
      day: 1,
      hoursStart: 16,
      hoursEnd: 17,
      minutesEnd: 30
    };

    // if time is inside set time for live chat
    if (
      // currNyTime.getDay() === 3 &&
      // (currNyTime.getHours() === 21 ||
      //   (currNyTime.getHours() === 22 && currNyTime.getMinutes() < 30))
      currNyTime.getDay() === liveChatTime.day &&
      (currNyTime.getHours() === liveChatTime.hoursStart ||
        (currNyTime.getHours() === liveChatTime.hoursEnd &&
          currNyTime.getMinutes() < liveChatTime.minutesEnd))
    ) {
      const timeToAcceptableFirebaseString = `live-${
        currNyTime.getMonth() + 1
        }-${currNyTime.getDate()}-${currNyTime.getFullYear()}`;

      Fire.shared.createLiveRoomIfDoesNotExist(
        timeToAcceptableFirebaseString,
        () => {
          this.communityPopup(timeToAcceptableFirebaseString);
        }
      );
    } else {
      Alert.alert(
        'Live Chat Unavailable',
        'Sorry we missed you! Live chat is available every Wednesday from 9PM EST until 10:30PM EST. No invitation necessary!',
        [{ text: 'See you next time!' }]
      );
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

  render() {
    return (
      <View>
        <View>
          <View style={styles.navbar}>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('CategoryList')}
              >
                <HomeIcon />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('UserPage')}
              >
                <UserIcon />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('PMList')}
              >
                <InboxIcon />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity onPress={this.liveChat}>
                <LiveIcon />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('PartnerList')}
              >
                <PartnerIcon />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('Resources')}
              >
                <ResourceIcon />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.replace('LottieSplash')}
              >
                <MaterialCommunityIcons name="test-tube" size={24} color="black" />
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.notifications}>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={10}
                color="transparent"
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={10}
                color="transparent"
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={10}
                color={this.state.numUnreadMessages ? 'blue' : 'transparent'}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={10}
                color={this.state.liveChatAvailable ? 'green' : 'transparent'}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={10}
                color="transparent"
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                flex: 1
              }}
            >
              <MaterialCommunityIcons
                name="checkbox-blank-circle"
                size={10}
                color="transparent"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 12,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 20,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 40
  },
  notifications: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 12,
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingTop: 0,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 40,
    marginRight: 40
  }
});

export default withNavigation(Navbar);
