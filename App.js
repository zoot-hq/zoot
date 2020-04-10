// Stack Navigation

import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';
import PMList from './components/PMList';

import { createStackNavigator } from 'react-navigation';

// disabled yellow comments/alerts
console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];


// FOR TESTING + CONSOLE PURPOSES
// Date in ms
let msDate = Date(Date.now());

// Converting the number of millisecond in date string 
let stringDate = msDate.toString()

// Printing the current date                     
console.log(`=========================== JS RELOAD at ${stringDate} ===============================`)

const navigator = createStackNavigator({
  Home,

  // remove swipe back gesture from chatlist
  ChatList: {
    name: 'ChatList',
    screen: ChatList,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  ChatRoom,
  Signup,
  Login,
  WelcomePage,
  PMList
},
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  });

export default navigator