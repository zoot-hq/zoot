import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Vibration,
  Alert
} from 'react-native';

import * as Font from 'expo-font';
import Fire from '../Fire';

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import {Notifications} from 'expo';
import {useFocusEffect} from '@react-navigation/native';

import moment from 'moment';

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      readyToLoad: false,
      expoPushToken: '',
      notification: {},
      liveChatBegins: moment(),
      notification: null
    };
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const {status: existingStatus} = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({expoPushToken: token});
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250]
      });
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

  async componentDidMount() {
    await this.registerForPushNotificationsAsync();
    const liveChatDay = 3;
    const today = moment().isoWeekday();
    if (today < liveChatDay) {
      // set the date to the 3 of this week
      this.setState({
        liveChatBegins: moment().isoWeekday(liveChatDay).hour(21)
      });
    } else if (today === liveChatDay) {
      const curHour = moment().hour();
      const curMin = moment().minute();
      // check if the hour is smaller than 9 pm.
      if (curHour < 21) {
        //if yes, schedule to today's livechat.
        this.setState({liveChatBegins: moment().hour(21).minute(0)});
      } else if (curHour === 21 || (curHour === 22 && curMin < 30)) {
        // If it's equal to, check if it's under ten thirty. If so, schedule notif for right now.
        this.setState({liveChatBegins: moment()});
      } else {
        //If it's greater than ten thirty, schedule wednesday next week
        this.setState({
          liveChatBegins: moment().add(1, 'weeks').isoWeekday(liveChatDay)
        });
      }
    } else {
      // use wednesday of next week
      this.setState({
        liveChatBegins: moment().add(1, 'weeks').isoWeekday(liveChatDay)
      });
    }
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    Notifications.addListener((notification) => {
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        this.setState({notification: notification});
        Vibration.vibrate();
        Alert.alert(
          'Live chat starting!',
          `It's happening! Our weekly live chat is starting now. Happy chatting!`,
          [
            {
              text: 'Take me to the live chat',
              onPress: () => {
                console.log('navigating to live chat');
                this.liveChat();
              }
            },
            {
              text: 'Not now',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            }
          ]
        );
      }
    });
    this.buildNotification();
    setInterval(() => {
      this.buildNotification();
    }, 604800000);
    // this.buildNotification();
  }

  _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({notification: notification});
  };

  buildNotification = () => {
    console.log(
      'in build notifications, the next chat begins ',
      this.state.liveChatBegins
    );
    Notifications.scheduleLocalNotificationAsync(
      {
        to: this.state.expoPushToken,
        title: 'Live Chat starting!',
        body: `It's happening! Our weekly live chat is starting now. Happy chatting!`,
        ios: {_displayInForeground: true}
      },
      {time: this.state.liveChatBegins.add(30, 'seconds').valueOf()}
    );
    console.log('===========leaving page===============');
    this.setState(
      {
        liveChatBegins: this.state.liveChatBegins.add(7, 'days')
      },
      console.log('new timer for live chat', this.state.liveChatBegins)
    );
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

  liveChat = () => {
    // get nyc time
    const currTime = new Date();
    const currNyTime = this.changeTimezone(currTime, 'America/New_York');
    const liveChatTime = {
      day: 4, //1,
      hoursStart: 20, //16,
      hoursEnd: 21, //17,
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
        [{text: 'See you next time!'}]
      );
    }
  };

  async componentWillMount() {
    // get fonts
    await Font.loadAsync({
      'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf'),
      'Futura-Light': require('../assets/fonts/FuturaLight.ttf'),
      'Futura-Medium': require('../assets/fonts/FuturaMedium.ttf')
    });

    // attempt to login user in
    const apresLoginEmail = await AsyncStorage.getItem('apresLoginEmail');
    const apresLoginPassword = await AsyncStorage.getItem('apresLoginPassword');
    const status = await Fire.shared.login(apresLoginEmail, apresLoginPassword);

    // if successful login, navigate in
    if (!status) {
      this.props.navigation.navigate('CategoryList');
    }

    // else navigate to regular login
    else this.setState({readyToLoad: true});
  }

  // // // returns the time left in milliseconds
  // howLongTillLive(targetTime) {
  //   let now = Date.now();
  //   let liveStart = new Date(targetTime);
  //   let difInTime = liveStart.getTime() - now;
  //   return difInTime;
  // }

  render() {
    if (!this.state.readyToLoad) {
      return null;
    }
    return (
      <View style={styles.container}>
        {/* title */}
        <Text style={styles.title}>après</Text>

        {/* log in button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>log in</Text>
        </TouchableOpacity>

        {/* sign up button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1
  },
  title: {
    fontSize: 120,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: -100,
    fontFamily: 'CormorantGaramond-Light'
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 0,
    paddingVertical: 5,
    marginBottom: 15,
    marginRight: 50,
    marginLeft: 50
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 40,
    fontFamily: 'Futura-Light'
  }
});
