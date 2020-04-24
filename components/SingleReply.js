import React, {Component} from 'react';
import {Text, StyleSheet, Platform, View} from 'react-native';
import * as firebase from 'firebase';

export default class AllReplies extends React.Component {
  constructor(props) {
    super(props);
    this.messageHeader = {
      user: firebase.auth().currentUser.displayName,
      time: this.getCurrentTime()
    };
  }
  getCurrentTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  }
  render() {
    console.log('messageHeader from SingleReply:', this.messageHeader);
    return (
      <View>
        <Text>
          {this.messageHeader.user}
          {this.messageHeader.time}
        </Text>
        <Text>This represents a single reply</Text>
      </View>
    );
  }
}

styles = StyleSheet.create({
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline'
  }
});
