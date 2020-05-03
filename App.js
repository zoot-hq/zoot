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
import CategoryList from './components/CategoryList';



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
    Home: {
      name: 'Home',
      screen: Home,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Splash: {
      name: 'Splash',
      screen: Splash,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    SplashContent,
    ChatList,
    ChatRoom,
    Signup: {
      name: 'Signup',
      screen: Signup,
      navigationOptions: {
        gesturesEnabled: true,
      }
    },
    Login: {
      name: 'Login',
      screen: Login,
      navigationOptions: {
        gesturesEnabled: true,
      }
    },
    PMList: {
      name: 'PMList',
      screen: PMList,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    UserPage: {
      name: 'UserPage',
      screen: UserPage,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Resources: {
      name: 'Resources',
      screen: Resources,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    Navbar,
    PartnerList: {
      name: 'PartnerList',
      screen: PartnerList,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
    CategoryList: {
      name: 'CategoryList',
      screen: CategoryList,
      navigationOptions: {
        gesturesEnabled: false,
      }
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false
    }
  }
);

export default navigator;
