import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {MaterialIndicator} from 'react-native-indicators';
import {Ionicons} from '@expo/vector-icons';
import * as firebase from 'firebase';
import {
  StackActions,
  NavigationActions,
  withNavigation
} from 'react-navigation';

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
    try {
      let partners = await this.getPartnerNames();
      this.setState({partnerNames: Object.keys(partners)});
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
      actions: [NavigationActions.navigate({routeName: 'ChatList'})]
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
          {/* titles */}
          <Text style={styles.title}>après</Text>
          <Text style={styles.subtitle}>
            Hey there! Après is proud to partner with our organizations. Users
            can privately interact with partnered organizations on Après by
            requesting a secret access code from the real- world organizations
            which they belong to.
          </Text>
        </View>
        <View style={styles.searchView}>
          <Searchbar
            theme={{colors: {primary: 'black'}}}
            placeholder="Search for a partnered organization"
            onChangeText={(query) => {
              const queriedPartners = this.state.partnerNames.filter(
                (partner) => {
                  return partner.toLowerCase().includes(query.toLowerCase());
                }
              );
              this.setState({queriedPartners, query});
              if (!query.length) {
                this.setState({queriedPartners: this.state.partnerNames});
              }
            }}
          />
          {/* partner board list */}
          <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding">
            <SafeAreaView>
              <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
                        this.getPartnerChatlist();
                        this.props.navigation.navigate('ChatList', {
                          partner: partner
                          // EV: if you leave in line 144, it'll pass a promise. If you await it, it'll pass nothing at all.
                          // chatrooms: this.state.selectedPartnerChatrooms
                        });
                      }}
                    >
                      <View style={styles.singleChatView}>
                        <Text style={styles.buttonText}># {partner}</Text>
                        <Ionicons name="md-people" size={25} color="grey">
                          {' '}
                        </Ionicons>
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
          </KeyboardAvoidingView>
        </View>

        <Navbar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    bottom: 15,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'CormorantGaramond-Light'
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
    margin: 10
  }
});

export default withNavigation(PartnerList);
