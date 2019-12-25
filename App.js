// Stack Navigation

import ChatList from './components/ChatList';
import Chat from './components/Chat';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

import { createStackNavigator } from 'react-navigation'

// disabled yellow comments/alerts
console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

const navigator = createStackNavigator({
  Home,
  ChatList,
  Chat,
  Signup,
  Login
},
{
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  }
});

export default navigator