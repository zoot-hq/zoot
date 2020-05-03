import * as React from 'react';
import {BackHandler, TouchableOpacity, View} from 'react-native';
import {NavigationContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation';

import BackIcon from '../assets/icons/BackIcon';

function BackButton(props) {
  return (
    <View>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <BackIcon />
      </TouchableOpacity>
    </View>
  );
}

export default BackButton;
