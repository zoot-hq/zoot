import React, {Component} from 'react';
import * as firebase from 'firebase';
import {Feather} from '@expo/vector-icons';
import Fire from '../Fire';

export default class BookmarkListIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false
    };
  }

  async componentDidMount() {
    await this.isInBookmarks(this.props.chatroom.name);
  }

  async isInBookmarks(chatroomName) {
    const bookmarked = await firebase
      .database()
      .ref('users')
      .child(Fire.shared.username())
      .child('bookmarks')
      .child(chatroomName)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
    if (bookmarked && bookmarked.name) {
      this.setState({bookmarked: true});
    }
  }

  async addToBookmarks(chatroom) {
    await firebase
      .database()
      .ref('users')
      .child(Fire.shared.username())
      .child('bookmarks')
      .child(chatroom.name)
      .set(chatroom);
  }

  render() {
    return (
      <Feather
        onPress={() => this.addToBookmarks(this.props.chatroom)}
        name="bookmark"
        size={15}
        style={{color: this.state.bookmarked ? 'black' : '#bfbfbf'}}
      >
        {' '}
      </Feather>
    );
  }
}
