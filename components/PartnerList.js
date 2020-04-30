import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MaterialIndicator } from 'react-native-indicators';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import {
  StackActions,
  NavigationActions,
  withNavigation
} from 'react-navigation';
import * as MailComposer from 'expo-mail-composer';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import Modal from 'react-native-modal';


import BookmarkIcon from '../assets/icons/BookmarkIcon';
import HelpIcon from '../assets/icons/HelpIcon';



import Navbar from './Navbar';
import ChatList from './ChatList';

export class PartnerList extends Component {
  constructor() {
    super();
    this.state = {
      passcode: '',
      passcodeModal: false,
      locked: true,
      unlocked: false,
      partnerNames: [],
      queriedPartners: [],
      query: '',
      selectedPartnerChatrooms: {}
    };
  }


  async componentDidMount() {

    // help alert
    this.helpAlert = () => {
      Alert.alert(
        'Help',
        'Hey there! \n\n Après is proud to partner with our organizations. \n\nUsers can privately interact with partnered organizations on Après by requesting a secret access code from the real - world organizations which they belong to.',
        [{ text: 'Got it!' }]
      )
    }

    // bookmark alert
    this.bookmark = () => {
      Alert.alert(
        'Bookmarks coming soon!',
        'Bookmarked boards are in the works. Hang tight!',
        [{ text: 'OK!' }]
      )
    }

    // testing 
    this.noGo = () => {
      Alert.alert(
        'Not working!',
        'Not working....',
        [{ text: 'K...' }]
      )
    }


    contactAdmin = async () => {
      const options = {
        recipients: ['info@apres.chat'],
        subject: 'Partnerning with Après',
        body: this.state.message
      };
      try {
        await MailComposer.composeAsync(options);
        this.setState({ contactFormModal: false });
      } catch (error) {
        if (error === 'Mail services are not available.') {
          this.setState({
            error:
              'We were unable to open up your mail app. Please contact our admins directly at info@apres.chat. '
          });
        }
      }
    }

    try {
      let partners = await this.getPartnerNames();
      this.setState({ partnerNames: Object.keys(partners) });
    } catch (error) {
      console.error(error);
    }

    try {
      let partners = await this.getPartnerNames();
      this.setState({ partnerNames: Object.keys(partners) });
    } catch (error) {
      console.error(error);
    }




  }

  async getPartnerNames() {
    let ref = firebase.database().ref(`partnerNames`);
    try {
      let query = await ref.once('value').then(function (snapshot) {
        return snapshot.val();
      });
      return query;
    } catch (error) {
      console.error(error);
    }
  }

  resetNavigation() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'ChatList' })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  // EV: it occurred to me here to load the partner's chatrooms on the partnerlist page. This didn't work because it required calling an async function when navigating (to pull up the chatrooms of the board that was clicked). I'm not sure why, but as soon as I did that, both navigation params (partner name and the actual chatlist) disappeared.
  // async getPartnerChatlist(partner) {
  //   let ref = firebase.database().ref(`partnerChatroomNames/${partner}`);
  //   try {
  //     let query = await ref.once('value').then(function (snapshot) {
  //       return snapshot.val();
  //     });
  //     this.setState({selectedPartnerChatrooms: query});
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }









  render() {
    console.log(this.state.partnerNames, 'partner names in state');

    const passcode = this.state.partnerNames.passcode;

    this.unlock = () => {
      this.setState({
        unlocked: true,
        locked: false,
        passcodeModal: false,
        error: false
      });
      // this.resetNavigation();
      // this.props.navigation.navigate('ChatList', {
      //   partner: partner
      // });
    }



    renderLock = () => {
      if (this.state.unlocked) {
        return (
          <Feather name="unlock" size={55} color="black"></Feather>
        )
      }
      if (this.state.locked) {
        return (
          <Feather name="lock" size={55} color="black"></Feather>
        )
      }
    }


    checkPasscode = () => {
      if (this.state.passcode === "1234") {
        return (
          this.unlock()
        )
      }
      else {
        return (
          this.noGo()
        )
      }
    }


    return (
      <View style={styles.container} >
        <View style={styles.innerView}>
          {/* bookmark button */}
          <View style={styles.help}>

            <TouchableOpacity
              onPress={() => this.bookmark()}
            >
              <BookmarkIcon />
            </TouchableOpacity>


            {/* help button */}

            <TouchableOpacity
              onPress={() => this.helpAlert()}
            >
              {/* <AntDesign name="questioncircleo" size={20} color="black" /> */}
              <HelpIcon />
            </TouchableOpacity>

          </View>


          {/* titles */}
          {/* <Text style={styles.title}>après</Text> */}
          <Text style={styles.subtitle2}>
            {/* Hey there! Après is proud to partner with our organizations. Users
            can privately interact with partnered organizations on Après by
            requesting a secret access code from the real- world organizations
            which they belong to. */}
            Partnered Organizations
          </Text>

        </View>
        <View style={styles.searchView}>
          <Searchbar
            theme={{ colors: { primary: 'black' } }}
            placeholder="Search for a partnered organization"
            onChangeText={(query) => {
              const queriedPartners = this.state.partnerNames.filter(
                (partner) => {
                  return partner.toLowerCase().includes(query.toLowerCase());
                }
              );
              this.setState({ queriedPartners, query });
              if (!query.length) {
                this.setState({ queriedPartners: this.state.partnerNames });
              }
            }}
          />
          {/* partner board list */}
          <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding">
            <SafeAreaView>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* if a query made, queried chatrooms displayed*/}
                {this.state.queriedPartners.length ? (
                  this.state.queriedPartners.map((partner, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.buttonContainer}
                    // onPress={() =>
                    //   this.props.navigation.navigate('ChatRoom', {
                    //     chatroom: chatroom.name
                    //   })
                    // }
                    >
                      <View style={styles.singleChatView}>
                        <Text style={styles.buttonText}># {partner}</Text>
                        <Ionicons name="md-people" size={25} color="grey">
                          {' '}
                        </Ionicons>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : // else if a search has not run but the list of partners isn't empty, display all partners
                  this.state.partnerNames.length ? (
                    this.state.partnerNames.map((partner) => (
                      <TouchableOpacity
                        key={partner}
                        style={styles.buttonContainer}
                        onPress={() => {
                          // this.resetNavigation();
                          // EV:line 140 is also an async function
                          // this.getPartnerChatlist();
                          // this.props.navigation.navigate('ChatList', {
                          //   partner: partner
                          //   // EV: if you leave in line 144, it'll pass a promise. If you await it, it'll pass nothing at all.
                          //   // chatrooms: this.state.selectedPartnerChatrooms
                          // });
                          this.setState({ passcodeModal: true })
                          this.resetNavigation();
                          this.props.navigation.navigate('ChatList', {
                            partner: partner
                          });
                        }
                        }>
                        <View style={styles.singleChatView}>
                          <Text style={styles.buttonText}>
                            <Feather name="unlock" size={25} color="black"></Feather> {`${partner}`}
                            {`\ntesting passcode: ${partner.passcode}`}
                          </Text>
                          {/* <Ionicons name="md-people" size={25} color="grey">
                          {' '}
                        </Ionicons> */}
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                      <View>
                        <Text>
                          We are not yet partnered with this organization.
                    </Text>
                      </View>
                    )}
              </ScrollView>
            </SafeAreaView>
            <TouchableOpacity onPress={() => contactAdmin()}><Text style={styles.subtitle}>Interested in partnering with Après? Click here to send us an email! </Text></TouchableOpacity>



            {/* <TouchableOpacity onPress={() => this.unlock()}> */}
            <TouchableOpacity onPress={() => this.setState({ passcodeModal: true })}>
              <Text>
                {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}CLICK HERE TO TEST LOCK/UNLOCK BELOW{'\n'}
                test password for unlocking = 1234{'\n'}
              </Text>
            </TouchableOpacity>

            <Modal isVisible={this.state.passcodeModal}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Enter Passcode</Text>
                {this.state.error ? (
                  <Text style={styles.modalText}>{this.state.error}</Text>
                ) : (
                    <Text style={styles.modalText}>
                      Your organization will provide you with a secret passcode to access thier private message boards on Après.
                    </Text>
                  )}
                <TextInput
                  returnKeyType="done"
                  placeholder="Enter passcode..."
                  placeholderTextColor="#bfbfbf"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  onChangeText={(passcode) => this.setState({ passcode })
                  }
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={{ width: 150 }}
                    onPress={() =>
                      this.setState({ passcodeModal: false, error: false })
                    }
                  >
                    <Text style={styles.modalButtonCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 150,
                      borderLeftWidth: 1,
                      borderLeftColor: 'gray'
                    }}
                    onPress={() => checkPasscode()}
                  >
                    <Text style={styles.modalButtonSave}>Enter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


            {renderLock()}





          </KeyboardAvoidingView>

        </View>

        <Navbar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  help: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: -30,
    marginBottom: 20,
    height: 20,
    zIndex: 999,
  },
  chatroomlist: {
    marginBottom: 30,
    height: 500
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
    flex: 5
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
    fontSize: 15,
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
    fontFamily: 'CormorantGaramond-Light',
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
    margin: 10,
  },
  modal: {
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    width: 300,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  modalText: {
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  input: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    borderLeftWidth: 0.5,
    borderLeftColor: 'gray',
    borderRightWidth: 0.5,
    borderRightColor: 'gray',
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 20,
    flexGrow: 1,
    textAlignVertical: 'bottom',
    marginLeft: 15,
    marginRight: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    minHeight: 30
  },
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'gray'
  },
  deleteModalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'gray',
    marginTop: 15
  },
  modalButtonCancel: {
    color: '#0073e6',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10
  },
  modalButtonSave: {
    color: '#0073e6',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFiledRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

export default withNavigation(PartnerList);
