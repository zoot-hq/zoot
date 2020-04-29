import React, { Component } from 'react';
import {
  Text,
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

import BookmarkIcon from '../assets/icons/BookmarkIcon';
import HelpIcon from '../assets/icons/HelpIcon';



import Navbar from './Navbar';
import ChatList from './ChatList';

export class PartnerList extends Component {
  constructor() {
    super();
    this.state = {
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
    return (
      <View style={styles.container}>
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
                          this.resetNavigation();
                          // EV:line 140 is also an async function
                          // this.getPartnerChatlist();
                          this.props.navigation.navigate('ChatList', {
                            partner: partner
                            // EV: if you leave in line 144, it'll pass a promise. If you await it, it'll pass nothing at all.
                            // chatrooms: this.state.selectedPartnerChatrooms
                          });
                        }}
                      >
                        <View style={styles.singleChatView}>
                          <Text style={styles.buttonText}>
                            <Feather name="unlock" size={25} color="black"></Feather> {`${partner}`}
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
            <TouchableOpacity onPress={() => contactAdmin()}><Text style={styles.subtitle}>Interested in partnering with Après? Click here to send us an email! Let’s chat. </Text></TouchableOpacity>
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
    margin: 10
  }
});

export default withNavigation(PartnerList);
