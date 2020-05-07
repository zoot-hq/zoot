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
import * as firebase from 'firebase';

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
      liveChatBegins: moment()
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

  // delete this if not using!
  // resetNavigation() {
  //   const resetAction = StackActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({routeName: 'CategoryList'})]
  //   });
  //   this.props.navigation.dispatch(resetAction);
  // }

  async leavePage() {
    // const timeTillLive = this.state.liveChatBegins.fromNow();
    // if (timeTillLive <= 0) {
    //   console.log('===========leaving page===============');
    //   await this.setState(
    //     {
    //       liveChatBegins: this.state.liveChatBegins.add(1, 'minutes')
    //     },
    //     this.buildNotification()
    //   );
    // }
  }

  async componentDidMount() {
    await this.registerForPushNotificationsAsync();
    console.log(
      'moment js time in state ============== ',
      this.state.liveChatBegins,
      ', in unix ================ ',
      this.state.liveChatBegins.valueOf()
    );
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this.buildNotification();
    this.listenForNotifications();
    setInterval(() => {
      this.buildNotification();
    }, 604800000);
    // this.buildNotification();
  }

  listenForNotifications = () => {
    Notifications.addListener((notification) => {
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        Alert.alert(notification.title, notification.body);
      }
    });
  };

  _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({notification: notification});
  };

  buildNotification = () => {
    Notifications.scheduleLocalNotificationAsync(
      {
        to: this.state.expoPushToken,
        sound: 'default',
        title: 'line 80',
        body: 'live notification!',
        data: {data: moment().format('MMMM D, YYYY h:mm A')},
        _displayInForeground: true
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
      this.leavePage();
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
