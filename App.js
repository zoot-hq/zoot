// Stack Navigation

import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import WelcomePage from './components/WelcomePage';
import PMRoom from './components/PMRoom';
import PMList from './components/PMList'

import { createStackNavigator } from 'react-navigation';

// disabled yellow comments/alerts
console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

const navigator = createStackNavigator({
  Home,

  // remove swipe back gesture from chatlist
  ChatList : {
    name: 'ChatList',
    screen: ChatList,
    navigationOptions: {
      gesturesEnabled: false,
    }
  },
  ChatRoom,
  PMRoom,
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