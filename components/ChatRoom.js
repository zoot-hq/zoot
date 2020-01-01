import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { MaterialIndicator } from 'react-native-indicators';

import SlackMessage from './SlackMessage'
import Fire from '../Fire';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      room: this.props.navigation.state.params.chatroom,
      messages: [],
      user: {
        name: Fire.shared.username(),
        _id: Fire.shared.uid(),
      },
      loadEarlier: true
    };

    this.sendImage.bind(this.sendImage)
  }


  componentDidMount = () => {

    //get messages for chatroom
    Fire.shared.on(this.state.room, (message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    }));
  }
  
  componentWillUnmount() {
    Fire.shared.off();
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle
    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  // load earlier messages from backend
  loadEarlier = async () => {

    this.setState( {isLoading : true})

    const newMessages = []

    for (let i = 0 ; i < 10; i ++) {
      await Fire.shared.loadEarlier(this.state.room, this.state.messages[this.state.messages.length-1], (message => {
        newMessages.push(message)
      }))

      this.setState(previousState => ({
        messages: GiftedChat.prepend(previousState.messages, newMessages.pop()),
      }))

    }

    this.setState( {isLoading : false})
  }

  // returns true if a user has scrolled to the top of all messages, false otherwise
  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  sendImage = (image) => {
    console.log('image in chatoom', this.state.room)
  }

  render() {

    return (
      <View style={{flex:1}}>
        <Text style={styles.title}># {this.state.room}</Text>
          <GiftedChat
            messages={this.state.messages}
            listViewProps={{
              scrollEventThrottle: 400,
              onScroll: ({ nativeEvent }) => {
                if (this.isCloseToTop(nativeEvent) && !this.state.isLoading) {
                  this.setState({isLoading: true});
                  this.loadEarlier();
                }
              }
            }}
            onSend={(messages) => Fire.shared.send(messages, this.state.room)}
            user={this.state.user}
            renderMessage={this.renderMessage} 
            renderAvatar={null}
            sendImage={this.sendImage}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    top: 0,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20
  }
});

