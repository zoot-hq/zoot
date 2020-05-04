import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import Modal from 'react-native-modal';
import Fire from '../Fire';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
import * as MailComposer from 'expo-mail-composer';
import {Ionicons, Feather, AntDesign} from '@expo/vector-icons';
import NavBar from './Navbar';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import HelpIcon from '../assets/icons/HelpIcon';

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      emailModal: false,
      passwordModal: false,
      newEmail: firebase.auth().currentUser.email,
      newPassword: '',
      passwordUpdated: false,
      deleteModal: false,
      deleteUser: false,
      contactFormModal: false,
      subject: '',
      message: '',
      error: false,
      selectedRole: ''
    };
    this.logout = this.logout.bind(this);
    this.roleList = [
      "I'm a New Mother.",
      "I'm a Surrogate.",
      "I'm a Gestational Carrier.",
      "I'm an Adoptive Parent.",
      "I'm a Hopeful Parent.",
      "I'm a Parent.",
      "I'm an Egg/Embryo Donor.",
      "I'n a New Parent.",
      "I'm Parent Recovering from Loss.",
      "I'm an Other Role Not Described Here.",
      "I'd Prefer Not to Disclose."
    ].map((role) => ({label: role, value: role}));
  }
  async componentDidMount() {
    // help alert
    this.helpAlert = () => {
      Alert.alert('Help', 'Update your information here.', [{text: 'Got it!'}]);
    };

    // bookmark alert
    this.bookmark = () => {
      this.props.navigation.navigate('ChatList', {
        bookmarks: true
      });
      // Alert.alert(
      //   'Bookmarks coming soon!',
      //   'Bookmarked boards are in the works. Hang tight!',
      //   [{text: 'OK!'}]
      // );
    };

    let role = await this.getUserInfo();
    this.setState({selectedRole: role});
  }
  async getUserInfo() {
    const name = this.state.user.displayName;
    let selectedRole = '';
    let ref = firebase.database().ref(`users/${name}`);
    let query = await ref.once('value').then(function (snapshot) {
      return snapshot;
    });
    selectedRole = await query.child('selectedRole').val();
    return selectedRole;
  }
  renderModal(type) {
    const stateObj = {};
    stateObj[type] = true;
    this.setState(stateObj);
  }
  async updateEmail() {
    if (this.state.newEmail) {
      await firebase
        .database()
        .ref('users/' + this.state.user.displayName)
        .update({
          email: this.state.newEmail
        });
      this.setState({error: false});
      this.state.user
        .updateEmail(this.state.newEmail)
        .then(() => this.setState({emailModal: false}))
        .catch((error) => this.setState({error: error.message}));
    } else {
      this.setState({error: 'Please enter a new email address.'});
    }
  }
  updatePassword() {
    if (this.state.newPassword) {
      this.setState({error: false});
      this.state.user
        .updatePassword(this.state.newPassword)
        .then(() =>
          this.setState({
            newPassword: '',
            passwordUpdated: true
          })
        )
        .catch((error) => this.setState({error: error.message}));
    } else {
      this.setState({error: 'Please enter a new password.'});
    }
  }
  async deleteUser() {
    this.setState({deleteUser: true, deleteModal: false});
    this.logout();
  }
  async logout() {
    await firebase
      .auth()
      .signOut()
      .then(
        AsyncStorage.removeItem('apresLoginEmail'),
        AsyncStorage.removeItem('apresLoginPassword').catch((error) =>
          this.setState({error: error.message})
        )
      )
      .then(this.goHome());
  }
  async updateRole() {
    await firebase
      .database()
      .ref('users/' + this.state.user.displayName)
      .update({
        selectedRole: this.state.selectedRole
      });
  }
  goHome() {
    this.props.navigation.replace('Home');
  }
  async componentWillUnmount() {
    if (this.state.deleteUser) {
      await this.state.user.delete().then(
        firebase
          .database()
          .ref('users')
          .child(this.state.user.displayName)
          .remove()
          .catch(function (error) {
            console.log(error);
          })
      );
    }
  }
  async contactAdmin() {
    const options = {
      recipients: ['info@apres.chat'],
      subject: this.state.subject,
      body: this.state.message
    };
    try {
      await MailComposer.composeAsync(options);
      this.setState({contactFormModal: false});
    } catch (error) {
      if (error === 'Mail services are not available.') {
        this.setState({
          error:
            'We were unable to open up your mail app. Please contact our admins directly at info@apres.chat. '
        });
      }
    }
  }
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
              {/* <AntDesign name="questioncircleo" size={20} color="black" /> */}
              <HelpIcon />
            </TouchableOpacity>
          </View>

          {/* <Text style={styles.title}>après</Text> */}
          <Text style={styles.subtitle2}>
            {/* Hey, {this.state.user.displayName}! This is your very own user page!
            Update your information here. */}
            User Page & Settings
          </Text>
          <ScrollView>
            {/* username section */}
            {/* <Text style={styles.username}>{this.state.user.displayName}</Text> */}
            <Text style={styles.userInfo}>
              username: {this.state.user.displayName}
            </Text>
            <Text></Text>
            {/* user email section */}
            <Text style={styles.userInfo}>email: {Fire.shared.email()}</Text>
            <TouchableOpacity onPress={() => this.setState({emailModal: true})}>
              <Text style={styles.userInfo}>Update email?</Text>
            </TouchableOpacity>
            <Modal isVisible={this.state.emailModal}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Update email</Text>
                {this.state.error ? (
                  <Text style={styles.modalText}>{this.state.error}</Text>
                ) : (
                  <Text style={styles.modalText}>
                    Type your new desired email address below.
                  </Text>
                )}
                <TextInput
                  returnKeyType="done"
                  placeholder="New email"
                  placeholderTextColor="#bfbfbf"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  onChangeText={(newEmail) => this.setState({newEmail})}
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={{width: 150}}
                    onPress={() =>
                      this.setState({emailModal: false, error: false})
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
                    onPress={() => this.updateEmail()}
                  >
                    <Text style={styles.modalButtonSave}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Text></Text>
            {/* user password section */}
            <TouchableOpacity onPress={() => this.renderModal('passwordModal')}>
              <Text style={styles.userInfo}>Update password?</Text>
            </TouchableOpacity>
            <Modal isVisible={this.state.passwordModal}>
              <View style={styles.modal}>
                {this.state.passwordUpdated ? (
                  <View>
                    <Text style={styles.modalTitle}>
                      Your password has been updated!
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          passwordUpdated: false,
                          passwordModal: false
                        })
                      }
                    >
                      <Text style={styles.modalButtonSave}>Ok!</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.modalTitle}>Update password</Text>
                    {this.state.error ? (
                      <Text style={styles.modalText}>{this.state.error}</Text>
                    ) : (
                      <Text style={styles.modalText}>
                        Type your new desired password below.
                      </Text>
                    )}
                    <TextInput
                      returnKeyType="done"
                      placeholder="New password"
                      placeholderTextColor="#bfbfbf"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry
                      style={styles.input}
                      onChangeText={(newPassword) =>
                        this.setState({newPassword})
                      }
                    />
                    <View style={styles.modalButtonsContainer}>
                      <TouchableOpacity
                        style={{width: 150}}
                        onPress={() =>
                          this.setState({
                            passwordModal: false,
                            passwordUpdated: false,
                            error: false
                          })
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
                        onPress={() => this.updatePassword()}
                      >
                        <Text style={styles.modalButtonSave}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </Modal>
            <Text></Text>
            {/* user's role section */}
            <Text style={styles.userInfo}>
              Currently, {this.state.selectedRole}
            </Text>
            <Text style={styles.userInfo}>
              Select from below to update your role.
            </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                style={{...pickerSelectStyles}}
                onValueChange={(value) => {
                  Promise.resolve(
                    this.setState({
                      selectedRole: value
                    })
                  ).then(() => this.updateRole());
                }}
                items={this.roleList}
                placeholder={{
                  label: 'Please select...',
                  value: null
                }}
              />
            </View>
            {/* contact us functionality */}
            <TouchableOpacity
              onPress={() => this.setState({contactFormModal: true})}
              style={styles.userPageButton}
            >
              <Text style={styles.buttonText}>contact us</Text>
            </TouchableOpacity>
            <Modal isVisible={this.state.contactFormModal}>
              <KeyboardAvoidingView style={styles.modal}>
                <Text style={styles.modalTitle}>Contact Us</Text>
                {this.state.error ? (
                  <Text style={styles.modalText}>{this.state.error}</Text>
                ) : (
                  <Text style={styles.modalText}>
                    If there is an issue you'd like us to address, send us a
                    message by filling out this form.
                  </Text>
                )}
                <TextInput
                  placeholder="Subject"
                  placeholderTextColor="#bfbfbf"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, {marginVertical: 5}]}
                  onChangeText={(subject) => this.setState({subject})}
                />
                <TextInput
                  returnKeyType="send"
                  placeholder="Message"
                  placeholderTextColor="#bfbfbf"
                  autoCapitalize="none"
                  multiline={true}
                  numberOfLines={5}
                  autoCorrect={false}
                  style={[
                    styles.input,
                    {
                      height: 100
                    }
                  ]}
                  onChangeText={(message) => this.setState({message})}
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={{width: 150}}
                    onPress={() =>
                      this.setState({contactFormModal: false, error: false})
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
                    onPress={() => this.contactAdmin()}
                  >
                    <Text style={styles.modalButtonSave}>Send</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
            {/* logout functionality */}
            <TouchableOpacity
              onPress={this.logout}
              style={styles.userPageButton}
            >
              <Text style={styles.buttonText}>log out</Text>
            </TouchableOpacity>
            {/* delete account functionality */}
            <TouchableOpacity
              onPress={() => this.setState({deleteModal: true})}
              style={styles.userPageButton}
            >
              <Text style={styles.buttonText}>delete</Text>
            </TouchableOpacity>
            <Modal isVisible={this.state.deleteModal}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Delete Account?</Text>
                {this.state.error ? (
                  <Text style={styles.modalText}>{this.state.error}</Text>
                ) : (
                  <Text style={styles.modalText}>
                    By pressing "Delete", your account will be permanently
                    deleted. This action cannot be undone.
                  </Text>
                )}
                <View style={styles.deleteModalButtonsContainer}>
                  <TouchableOpacity
                    style={{width: 150}}
                    onPress={() =>
                      this.setState({deleteModal: false, error: false})
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
                    onPress={() => this.deleteUser()}
                  >
                    <Text style={styles.modalButtonSave}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
        <NavBar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    paddingBottom: 40
  },
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
  innerView: {
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    flex: 1
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
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
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Futura-Light',
    marginTop: 10,
    marginLeft: 50,
    marginRight: 50
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
  username: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Futura-Light',
    marginTop: 10
  },
  userInfo: {
    fontSize: 17,
    fontWeight: '300',
    marginBottom: 2,
    fontFamily: 'Futura-Light',
    marginTop: 2,
    marginLeft: 30,
    marginRight: 30
  },
  userPageButton: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 25,
    width: 200,
    borderWidth: 0,
    borderColor: 'black'
  },
  buttonText: {
    fontFamily: 'Futura-Light',
    fontSize: 25,
    textAlign: 'center'
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
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    alignSelf: 'center',
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Futura-Light',
    width: 300
  }
});
