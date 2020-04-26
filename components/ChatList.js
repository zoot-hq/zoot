import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import Fire from '../Fire';
import { MaterialIndicator } from 'react-native-indicators';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import {componentDidMount as loadNavbar} from './Navbar'
import Navbar from './Navbar';

export default class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatrooms: [],
      queriedChatrooms: [],
      query: '',
      partner: null
    };
  }
  // EV: this was component Will Mount - had to change it to "did" because otherwise it can't update state (apparently you can't do that from an unmounted component). This was eventually what worked! It still gave me a warning, but it also worked.
  async componentDidMount() {

    // help icon
    this.helpAlert = () => {
      Alert.alert(
        'Help @ Home',
        'Welcome to après!\n\n This is your home page.\n\n Use the navbar to navigate to your user page, your personal messages, live chat, our partnered boards, and the resources page. \n\n Search our message boards for a topic you\'re interested in. Don\'t see it already? Press the + icon to create it, and start the conversation! ',
        [{ text: 'Got it!' }]
      )
    }

    // This updates the partner property in the state successfully
    const { params } = this.props.navigation.state;
    console.log({ params });
    if (params) {
      const partner = params.partner ? params.partner : null;
      await this.setState(
        { partner: partner },
        console.log('partner in state at line 40, ', this.state.partner)
      );
    }

    // EV: One thing I tried to do is add the partner (from state) to the arguments of Fire.shared.getChatroomNames, then adding it to the function in fire.js (see there, line 379).
    // grab chatrooms = every room has a name and numOnline attribute
    Fire.shared.getChatRoomNames((newRoom) => {
      const queriedChatrooms = this.state.queriedChatrooms;
      if (newRoom.name) {
        if (
          newRoom.name.toLowerCase().includes(this.state.query.toLowerCase())
        ) {
          queriedChatrooms.push(newRoom);
        }

        // update state
        this.setState({
          chatrooms: [...this.state.chatrooms, newRoom].sort((a, b) =>
            a.name > b.name ? 1 : -1
          ),
          queriedChatrooms: queriedChatrooms.sort((a, b) =>
            a.name > b.name ? 1 : -1
          )
        });
      }
      // add room to querried rooms if query matches
    }, this.state.partner);

    // update numOnline as it changes in database
    Fire.shared.getUpdatedNumOnline((updatedRoom) => {
      this.setState({
        chatrooms: this.state.chatrooms.map((chatroom) => {
          if (chatroom.name === updatedRoom.name) {
            return updatedRoom;
          }
          return chatroom;
        }),
        queriedChatrooms: this.state.queriedChatrooms.map((chatroom) => {
          if (chatroom.name === updatedRoom.name) {
            return updatedRoom;
          }
          return chatroom;
        })
      });
    });

    // get permissions for notifications
    this.registerForPushNotificationsAsync();

    // set what the app does when a user clicks on notification
    this._notificationSubscription = Notifications.addListener(
      (notification) => {
        const { pm, room } = notification.data;

        // if notification is due to pm
        if (pm) {
          // navigate to the message
          this.props.navigation.navigate('ChatRoom', {
            chatroom: room,
            PM: true
          });
        }
      }
    );
  }

  registerForPushNotificationsAsync = async () => {
    if (!Constants.isDevice) return;
    try {
      // ask for permissions - (only asks once)
      await Permissions.askAsync(Permissions.NOTIFICATIONS);

      // get push notifications token
      token = await Notifications.getExpoPushTokenAsync();

      // push token to firebase
      Fire.shared.sendNotificationToken(token);

      const livechatnotif = {
        title: 'live chat',
        body: 'live chat starting now',
      }

      const schedulingOptions = {
        time: (new Date()).getTime() + 1000,
        repat: 'weekly'
      }

      // schedule live chat notifications
      Notifications.scheduleLocalNotificationAsync(livechatnotif, schedulingOptions)

    } catch (error) { }
  };

  componentWillUnmount() {
    console.log('unmount firing >>>>>>>');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerView}>

          {/* help button */}
          <View style={styles.help}>
            <TouchableOpacity
              onPress={() => this.helpAlert()}
            >
              <AntDesign name="questioncircleo" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* titles */}
          <Text style={styles.title}>après</Text>
          <Text style={styles.subtitle}>
            Welcome.{'\n'}What type support are you here for?
          </Text>
        </View>

        <View style={styles.testingView}>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SplashContent')}>
            <Text style={styles.subtitle}>Splash Test</Text>
          </TouchableOpacity>
        </View>


        {/* navigation to user profile for development purposes
        < */}
        {/* <View style={styles.testingView}>
          <Text style={styles.subtitle} > For testing purposes only:</Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('UserPage')}>
            <Text style={styles.subtitle}>User Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Resources')}>
            <Text style={styles.subtitle}>Resources</Text>
          </TouchableOpacity>


          <View
            style={{
              display: 'flex',
              alignItems: 'space-between',
              marginTop: 10,
              flexDirection: 'row',
              alignSelf: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('PMList')}
            >
              <Ionicons name="ios-chatbubbles" size={30} color="grey"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.liveChat}>
              <MaterialIcons
                name="speaker-phone"
                size={30}
                color={this.state.liveChatAvailable ? 'green' : 'grey'}
              ></MaterialIcons>
            </TouchableOpacity>
          </View>
        </View>

 */}

        {/* search bar - queries all chatrooms to the users query */}
        <View style={styles.searchView}>
          <Searchbar
            theme={{ colors: { primary: 'black' } }}
            placeholder="Search our message boards"
            onChangeText={(query) => {
              const queriedChatrooms = this.state.chatrooms.filter(
                (chatroom) => {
                  return chatroom.name
                    .toLowerCase()
                    .includes(query.toLowerCase());
                }
              );
              this.setState({ queriedChatrooms, query });
              if (!query.length) {
                this.setState({ queriedChatrooms: this.state.chatrooms });
              }
            }}
          />
          {/* chatroom list */}
          <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding">
            <SafeAreaView>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* if a query made, queried chatrooms displayed*/}
                {this.state.queriedChatrooms.length ? (
                  this.state.queriedChatrooms.map((chatroom) => (
                    <TouchableOpacity
                      key={chatroom.name}
                      style={styles.buttonContainer}
                      onPress={() =>
                        this.props.navigation.navigate('ChatRoom', {
                          chatroom: chatroom.name
                        })
                      }
                    >
                      <View style={styles.singleChatView}>
                        <Text style={styles.buttonText}># {chatroom.name}</Text>
                        <Ionicons name="md-people" size={25} color="grey">
                          {' '}
                          {chatroom.numOnline}
                        </Ionicons>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : // else allow user to create a new chatroom
                  this.state.chatrooms.length ? (
                    <View>
                      <Text>
                        No results. Would you like to create this chatroom?
                    </Text>
                      <TouchableOpacity
                        key={this.state.query}
                        style={styles.buttonContainer}
                        onPress={() => {
                          Fire.shared.createChatRoom(this.state.query);
                          this.props.navigation.navigate('ChatRoom', {
                            chatroom: this.state.query
                          });
                        }}
                      >
                        <Text style={styles.buttonText}>
                          + {this.state.query}{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                      // return loading while grabbing data from database
                      <MaterialIndicator color="black" />
                    )}
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>

        <Navbar navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  help: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    marginTop: -30,
    marginBottom: 20,
    height: 20,
    zIndex: 999,
  },
  chatroomlist: {
    marginBottom: 30,
    height: 300
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    flex: 1
  },
  searchView: {
    marginTop: 0,
    marginRight: 20,
    marginLeft: 20,
    flex: 2
  },
  innerView: {
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    flex: 1
  },
  title: {
    bottom: 10,
    fontSize: 120,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'CormorantGaramond-Light',
    marginTop: -15,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Futura-Light',
    marginTop: 10
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    marginTop: 5,
    marginLeft: 5
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 28,
    fontFamily: 'Futura-Light'
  },
  searchbar: {
    color: 'black',
    marginBottom: 20
  },
  numOnline: {
    fontSize: 20,
    fontFamily: 'Futura-Light'
  },
  singleChatView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  testingView: {
    borderColor: 'red',
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 40,
    margin: 20,
  }
});
