// Stack Navigation

import Main1 from './components/Main1';
import Chat from './components/Chat';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';

import { createStackNavigator } from 'react-navigation'

const navigator = createStackNavigator({
  Home,
  Main1,
  Chat,
  Signup,
  Login
});

export default navigator