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
import Fire from '../Fire';
import { MaterialIndicator } from 'react-native-indicators';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';

import NavBar from './Navbar';

export default class PMList extends React.Component {
  constructor() {
    super();
    this.state = {
      chatrooms: [],
      grabbed: false
    };
  }

  componentWillMount() {
    //grab chatrooms
    Fire.shared.getPMRooms((room) => {
      this.setState({
        chatrooms: [...this.state.chatrooms, room],
        grabbed: true
      });
    });

    // help icon
    this.helpAlert = () => {
      Alert.alert(
        'Help @ Personal Messages',
        'Ready to chat some more? When you start a private message with another user, it will appear here.\n\nTo get started, navigate back to the home page, click on a message board, and longpress on a user\'s name. \n\n A new chat will then open up between you and that user, and it will also appear on this list. \n\n Happy chatting!',
        [{ text: 'Got it!' }]
      )
    }
  }

  componentWillUnmount() {
    Fire.shared.off();
  }

  getRoomName(name) {
    const currentUser = Fire.shared.username();
    const names = name.split('-');
    if (names[0] === currentUser) {
      return names[1];
    } else if (names[1] === currentUser) {
      return names[0];
    }
  }

  render() {
    if (!this.state.grabbed) {
      return <MaterialIndicator color="black" />;
    }
    return (
      <View style={styles.outerContainer}>

        {/* <View style={styles.container}> */}
        <View style={styles.innerView}>

          {/* help icon */}
          <View style={styles.help}>
            <TouchableOpacity
              onPress={() => this.helpAlert()}
            >
              <AntDesign name="questioncircleo" size={20} color="black" />
            </TouchableOpacity>
          </View>




          {/* titles */}
          <Text style={styles.title}>après</Text>


          <Text style={styles.subtitle2}>
            Personal Messages
            </Text>

          <ScrollView>

            <KeyboardAvoidingView behavior="padding">
              <SafeAreaView>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  {this.state.chatrooms.length
                    ? this.state.chatrooms.map((chatroom) =>
                      !!chatroom ? (
                        <TouchableOpacity
                          key={chatroom}
                          style={styles.buttonContainer}
                          onPress={() =>
                            this.props.navigation.navigate('ChatRoom', {
                              chatroom,
                              PM: true
                            })
                          }
                        >
                          <Text style={styles.buttonText}>
                            # {this.getRoomName(chatroom)}
                          </Text>
                        </TouchableOpacity>
                      ) : null
                    )
                    : null}
                </ScrollView>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        {/* </View> */}

        <NavBar />
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
  outerContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  innerView: {
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    flex: 1
  },
  container: {
    display: 'flex',
    marginRight: 20,
    marginLeft: 20,
    justifyContent: 'center',
    marginTop: 50,
    flex: 1,
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
  subtitle2: {
    fontSize: 40,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 15,
    fontFamily: 'Futura-Light',
    marginTop: 10
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    paddingVertical: 5,
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
    marginBottom: 20,
    fontFamily: 'Futura-Light'
  }
});
