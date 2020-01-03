import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { MaterialIndicator } from 'react-native-indicators';
import { MaterialIcons } from '@expo/vector-icons';
import SlackMessage from './SlackMessage'
import Fire from '../Fire';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      room: this.props.navigation.state.params.chatroom || this.props.navigation.state.params.comboName,
      messages: [],
      user: {
        name: Fire.shared.username(),
        _id: Fire.shared.uid(),
      },
      loadEarlier: true
    };
  }


  componentDidMount = () => {

    //get messages for chatroom
    Fire.shared.on(this.state.room, (message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    }));

    setTimeout(() => { 
      Fire.shared.enterRoom(this.state.room)
    }, 1500);
  }
  
  componentWillUnmount = () => {
    Fire.shared.leaveRoom(this.state.room)
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


  uploadImage = async() => {

    // get permission to access camera roll
    await Permissions.askAsync(Permissions.CAMERA_ROLL)

    // grab picture
    const image = await ImagePicker.launchImageLibraryAsync({base64:true, quality:0})

    // send to database
    if (image) {
      Fire.shared.sendImage(image, this.state.room)
    }
  }

  renderChatFooter = () => {
    return (
      <TouchableOpacity style={styles.chatFooter} onLongPress={() => this.uploadImage()}>
        <MaterialIcons name='photo' color='grey' size={30}></MaterialIcons>
      </TouchableOpacity>
    )
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
              },
              navigation: this.props.navigation
            }}
            onSend={(messages) => Fire.shared.send(messages, this.state.room)}
            user={this.state.user}
            renderMessage={this.renderMessage} 
            renderAvatar={null}
            sendImage={this.sendImage}
            renderLoading={() =>  <MaterialIndicator color='black' />}
            renderChatFooter={this.renderChatFooter}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    top: 15,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    fontFamily: "CormorantGaramond-Light"
  },
  chatFooter: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

