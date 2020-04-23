import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import Fire from '../Fire';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
import * as MailComposer from 'expo-mail-composer';

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
      'A New Mother',
      'A Surrogate',
      'A Gestational Carrier',
      'An Adoptive Parent',
      'A Hopeful Parent',
      'A Parent',
      'An Egg/Embryo Donor',
      'A New Parent',
      'A Parent Recovering from Loss',
      'Other',
      'Prefer Not to Disclose'
    ].map((role) => ({label: role, value: role}));
  }
  async componentDidMount() {
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
  updateEmail() {
    if (this.state.newEmail) {
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
    this.setState({deleteUser: true});
    this.logout();
  }
  async logout() {
    await this.updateDB();
    await firebase
      .auth()
      .signOut()
      .then(
        await AsyncStorage.removeItem('apresLoginEmail'),
        await AsyncStorage.removeItem('apresLoginPassword').catch((error) =>
          this.setState({error: error.message})
        )
      );
    this.goHome();
  }
  async updateDB() {
    await firebase
      .database()
      .ref('users/' + this.state.user.displayName)
      .update({
        selectedRole: this.state.selectedRole,
        email: this.state.newEmail
      });
  }
  goHome() {
    this.props.navigation.navigate('Home');
  }
  async componentWillUnmount() {
    console.log('deleteUser?', this.state.deleteUser);
    if (this.state.deleteUser) {
      await this.state.user.delete().then(
        await firebase
          .database()
          .ref('users')
          .child(this.state.user.displayName)
          .remove()
          .catch(function (error) {
            console.log(error);
          })
      );
      console.log('end of delete user functionality');
    } else {
      await this.updateDB();
    }
  }
  async contactAdmin() {
    const options = {
      recipients: ['aprshq@gmail.com'],
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
            'We were unable to open up your mail app. Please contact our admins directly at aprshq@gmail.com. '
        });
      }
    }
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>après</Text>
          <Text style={styles.subtitle}>
            Hey, {this.state.user.displayName}! This is your very own user page!
            Update your information here.
          </Text>
          {/* username section */}
          <Text style={styles.username}>{this.state.user.displayName}</Text>
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
                    onChangeText={(newPassword) => this.setState({newPassword})}
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
            Currently, I'm {this.state.selectedRole}
          </Text>
          <Text style={styles.userInfo}>
            Select from below to update your role.
          </Text>
          <RNPickerSelect
            style={{...pickerSelectStyles}}
            onValueChange={(value) => {
              this.setState({
                selectedRole: value
              });
            }}
            items={this.roleList}
            placeholder={{
              label: 'Please select...',
              value: null
            }}
          />
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
          <TouchableOpacity onPress={this.logout} style={styles.userPageButton}>
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
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1
  },
  title: {
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 15,
    fontFamily: 'CormorantGaramond-Light'
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
    paddingBottom: 5,
    width: 200,
    borderWidth: 1,
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
    color: 'black'
  }
});
