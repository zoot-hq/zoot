import React, {Component} from 'react';
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
import {Searchbar} from 'react-native-paper';
import {MaterialIndicator} from 'react-native-indicators';
import {Ionicons, Feather, AntDesign} from '@expo/vector-icons';
import * as firebase from 'firebase';
import Fire from '../Fire';
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
  useClearByFocusCell
} from 'react-native-confirmation-code-field';

import Modal from 'react-native-modal';

import BookmarkIcon from '../assets/icons/BookmarkIcon';
import HelpIcon from '../assets/icons/HelpIcon';
import InfoIcon from '../assets/icons/InfoIcon';
import ChevronIcon from '../assets/icons/ChevronIcon';

import Navbar from './Navbar';

export class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryNames: [],
      categoryName: '',
      passcodes: [],
      queriedcategorys: [],
      query: '',
      showDescription: false,
      selectedcategoryChatrooms: {},
      currentCategory: {},
      currentUserName: firebase.auth().currentUser.displayName
    };
  }

  async componentDidMount() {
    // help alert
    this.helpAlert = () => {
      Alert.alert(
        'Help',
        'Hey there! \n\n Après is proud to category with our organizations. \n\nUsers can privately interact with categoryed organizations on Après by requesting a secret access code from the real - world organizations which they belong to.',
        [{text: 'Got it!'}]
      );
    };

    // bookmark alert
    this.bookmark = () => {
      Alert.alert(
        'Bookmarks coming soon!',
        'Bookmarked boards are in the works. Hang tight!',
        [{text: 'OK!'}]
      );
    };

    try {
      let categorys = await this.getcategoryNames();
      this.setState({categoryNames: Object.values(categorys)});
    } catch (error) {
      console.error(error);
    }
  }

  async getcategoryNames() {
    let ref = firebase.database().ref(`categoryNames`);
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
      actions: [NavigationActions.navigate({routeName: 'CategoryList'})]
    });
    this.props.navigation.dispatch(resetAction);
  }

  setCurrentCategory = (category) => {
    this.setState({currentCategory: category});
  };

  toggleDescription = (category) => {
    if (
      this.state.showDescription === true &&
      category.name === this.state.currentCategory.name
    ) {
      return (
        <View style={styles.insideButton}>
          <TouchableOpacity
            key={category.name}
            onPress={() => {
              this.resetNavigation();
              this.props.navigation.navigate('ChatList', {
                category: category.name
              });
            }}
          >
            <Text style={styles.description}>
              {this.state.currentCategory.description}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.insideButton}>
          <TouchableOpacity
            key={category.name}
            onPress={() => {
              this.resetNavigation();
              this.props.navigation.navigate('ChatList', {
                category: category.name
              });
            }}
          >
            <Text style={styles.buttonText}>{category.name}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerView}>
          {/* bookmark button */}
          <View style={styles.help}>
            <TouchableOpacity onPress={() => this.bookmark()}>
              <BookmarkIcon />
            </TouchableOpacity>

            {/* help button */}

            <TouchableOpacity onPress={() => this.helpAlert()}>
              <HelpIcon />
            </TouchableOpacity>
          </View>

          {/* titles */}

          <Text style={styles.title}>après</Text>

          <Text style={styles.subtitle}>
            Welcome.{'\n'}What type support are you here for?
          </Text>
        </View>

        <View style={styles.searchView}>
          {/* category list */}
          <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding">
            <SafeAreaView>
              <ScrollView contentContainerStyle={{flexGrow: 1}}>
                {this.state.categoryNames
                  .slice(0)
                  .reverse()
                  .map((category) => (
                    // <View key={category.name}>

                    <View key={category.name} style={styles.buttonContainer}>
                      <View style={styles.singleChatView}>
                        <View style={styles.info}>
                          <TouchableOpacity
                            key={category.name}
                            onPress={() => {
                              this.setState({
                                currentCategory: category,
                                showDescription: !this.state.showDescription
                              });
                            }}
                          >
                            <InfoIcon />
                          </TouchableOpacity>
                        </View>

                        {/* <View style={styles.insideButton}>
                                                <TouchableOpacity
                                                    key={category.name}
                                                    onPress={() => {
                                                        setCurrentCategory(category);
                                                        this.resetNavigation();
                                                        this.props.navigation.navigate('ChatList', {
                                                            category: category.name

                                                        })
                                                    }
                                                    }
                                                > */}

                        {/* <Text style={styles.buttonText}>
                                                                {`${category.name}`}</Text> */}

                        {/* <Text style={styles.subtitle}>{`\n${category.description}`}</Text> */}

                        {/* </TouchableOpacity> */}
                        {/* </View> */}

                        {this.toggleDescription(category)}

                        <View style={styles.chevron}>
                          <TouchableOpacity
                            key={category.name}
                            onPress={() => {
                              // setCurrentCategory(category);
                              this.resetNavigation();
                              this.props.navigation.navigate('ChatList', {
                                category: category.name
                              });
                            }}
                          >
                            <ChevronIcon />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    // </View>
                  ))}
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
  help: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: -10,
    marginBottom: 20,
    height: 20,
    zIndex: 999
  },
  chatroomlist: {
    marginBottom: 30,
    flex: 2
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
    marginTop: -15
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Futura-Light',
    marginTop: -10,
    marginBottom: 10
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
    padding: 10,
    marginTop: 5,
    marginLeft: 5
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 42,
    fontFamily: 'Futura-Light',
    padding: 15
  },
  searchbar: {
    color: 'black',
    marginBottom: 20
  },
  numOnline: {
    fontSize: 20,
    fontFamily: 'Futura-Light'
  },
  testingView: {
    borderColor: 'red',
    borderStyle: 'dashed',
    borderWidth: 1,
    margin: 10
  },
  modal: {
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    width: 300,
    alignSelf: 'center'
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
  info: {
    // borderColor: 'pink',
    // borderWidth: 2,
    // borderStyle: 'solid',
    alignSelf: 'flex-start',
    marginRight: 8,
    flex: 0.5
  },
  chevron: {
    // borderColor: 'orange',
    // borderWidth: 2,
    // borderStyle: 'solid',
    // marginLeft: 8,
    flex: 0.5,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  singleChatView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: 'yellow',
    // borderWidth: 2,
    // borderStyle: 'solid',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  insideButton: {
    // borderColor: 'blue',
    // borderWidth: 2,
    // borderStyle: 'solid',
    flex: 5,
    alignItems: 'center'
  },
  description: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
    fontFamily: 'Futura-Light',
    padding: 4
  }
});

export default withNavigation(CategoryList);
