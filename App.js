// Stack Navigation

import Main from './components/Main';
import Chat from './components/Chat';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

import { createStackNavigator } from 'react-navigation'

const navigator = createStackNavigator({
  Login,
  Main,
  Chat,
  Home,
  Signup,
  // Login
});

export default navigator