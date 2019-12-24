// Stack Navigation

import chatList from './components/chatList';
import Chat from './components/Chat';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

import { createStackNavigator } from 'react-navigation'

const navigator = createStackNavigator({
  Home,
  chatList,
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