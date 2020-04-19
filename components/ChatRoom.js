import React from 'react'
import { View, Text, StyleSheet, AppState, Alert} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { MaterialIndicator } from 'react-native-indicators';
import SlackMessage from './SlackMessage'
import Fire from '../Fire';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      room: this.props.navigation.state.params.chatroom,
      pm: this.props.navigation.state.params.PM,
      live: this.props.navigation.state.params.live,
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
    Fire.shared.on(this.state.room, this.state.pm, this.state.live, (message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    }));

    // set timeout for enter message
    setTimeout(() => {
      Fire.shared.enterRoom(this.state.room, this.state.pm, this.state.live)
    }, 1500)

    // set event listener for a user exit
    AppState.addEventListener('change', this.handleAppStateChange)

    // set error handler to ensure leave room event on app crash
    const defaultErrorHandler = ErrorUtils.getGlobalHandler()
    ErrorUtils.setGlobalHandler((e, isFatal) => {
      Fire.shared.leaveRoom(this.state.room, this.state.pm, this.state.live)
      defaultErrorHandler(e, isFatal)
    })

    // set timer for chat end
    if (this.state.live) {
      this.intervalID = setInterval(() => {

        // get nyc time
        const currTime = new Date()
        const currNyTime = this.changeTimezone(currTime, "America/New_York")

        // if time is outside set time for live chat
        if(!(currNyTime.getDay() === 2 && (currNyTime.getHours() === 21 || (currNyTime.getHours() === 22 && currNyTime.getMinutes() < 30)))) 
          Alert.alert(
            'This live chat has ended',
            'We welcome you to join us again next week!',
            [{ text: 'See you next time!', onPress: () => this.props.navigation.replace('ChatList')}]
        )
        }, 30000)
    }
  }

  changeTimezone = (date, ianatz) => {

    const invdate = new Date(date.toLocaleString('en-US', {
      timeZone: ianatz
    }))
    const diff = date.getTime() - invdate.getTime()
    return new Date(date.getTime() + diff)
  }

  handleAppStateChange = () => {
    if (AppState.currentState.match(/inactive/)) {
      Fire.shared.leaveRoom(this.state.room, this.state.pm, this.state.live)
    }

    else if (AppState.currentState.match(/active/)) {
      Fire.shared.enterRoom(this.state.room, this.state.pm, this.state.live)
    }
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this.handleAppStateChange)
    Fire.shared.leaveRoom(this.state.room, this.state.pm, this.state.live)
    Fire.shared.off()
    clearInterval(this.intervalID)
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
      await Fire.shared.loadEarlier(this.state.room, this.state.messages[this.state.messages.length-1], this.state.pm, (message => {
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

  // renderChatFooter = () => {
  //   return (
  //     <TouchableOpacity style={styles.chatFooter} onPress={() => this.uploadImage()}>
  //       <MaterialIcons name='photo' color='grey' size={30}></MaterialIcons>
  //     </TouchableOpacity>
  //   )
  // }

  render() {

    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginBottom: 40}}>
          <Text style={styles.title}># {this.state.room}</Text>
          <Text style = {styles.tips}>Welcome to #{this.state.room}. React to posts by longpressing icons beneath messages. Press the flag icon to flag abusive messages, and press the block icon to block abusive users. Swipe right to return to the home screen.</Text>
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
              onSend={(messages) => Fire.shared.send(messages, this.state.room, this.state.pm, this.state.live)}
              user={this.state.user}
              renderMessage={this.renderMessage}
              renderAvatar={null}
              sendImage={this.sendImage}
              renderLoading={() =>  <MaterialIndicator color='black' />}
              // renderChatFooter={this.renderChatFooter}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    top: 10,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
    fontFamily: "CormorantGaramond-Light",
  },
  tips: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 5,
    fontFamily: "Futura-Light",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  chatFooter: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  }
});
