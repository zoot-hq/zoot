// Stack Navigation

import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';
import PMList from './components/PMList';
import UserPage from './components/UserPage';
import Resources from './components/Resources';
import Navbar from './components/Navbar';
import { createStackNavigator } from 'react-navigation';
import PartnerList from './components/PartnerList';
import Splash from './components/Splash';
import SplashContent from './components/SplashContent';



// disabled yellow comments/alerts
console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

// FOR TESTING + CONSOLE PURPOSES
// Date in ms
let msDate = Date(Date.now());

// Converting the number of millisecond in date string
let stringDate = msDate.toString();

// Printing the current date
console.log(
  `=========================== JS RELOAD at ${stringDate} ===============================`
);

<StatusBar hidden />

const navigator = createStackNavigator(
  {
    Home,
    Splash,
    SplashContent,
    // remove swipe back gesture from chatlist
    ChatList: {
      name: 'ChatList',
      screen: ChatList,
      navigationOptions: {
        // gesturesEnabled: false,
      }
    },
    ChatRoom,
    Signup,
    Login,
    WelcomePage,
    PMList,
    UserPage,
    Resources,
    Navbar,
    PartnerList,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
);

export default navigator;
