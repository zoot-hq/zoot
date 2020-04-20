import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Modal from 'react-native-modal';
import Fire from '../Fire';
import firebase from 'firebase';

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameModal: false,
      emailModal: false,
      passwordModal: false,
      newUsername: '',
      newEmail: '',
      error: false
    };
    this.user = firebase.auth().currentUser;
  }
  renderModal(type) {
    const stateObj = {};
    stateObj[type] = true;
    this.setState(stateObj);
  }
  updateUsername() {
    if (this.state.newUsername) {
      this.setState({error: false});
      this.user
        .updateProfile({displayName: this.state.newUsername})
        .then(() => this.setState({newUsername: '', userNameModal: false}))
        .catch((error) => this.setState({error: error}));
    } else {
      this.setState({error: true});
    }
  }
  updateEmail() {
    if (this.state.newEmail) {
      this.setState({error: false});
      this.user
        .updateEmail(this.state.newEmail)
        .then(() => this.setState({newEmail: '', emailModal: false}))
        .catch((error) => this.setState({error: error}));
    } else {
      this.setState({error: true});
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>après</Text>
        <Text style={styles.subtitle}>
          Hey, {Fire.shared.username()}! This is your very own user page! Update
          your information here.
        </Text>
        {/* username section */}
        <Text style={styles.username}>{Fire.shared.username()}</Text>
        <Text style={styles.userInfo}>username: {Fire.shared.username()}</Text>
        <TouchableOpacity onPress={() => this.renderModal('userNameModal')}>
          <Text style={styles.userInfo}>Update username?</Text>
        </TouchableOpacity>
        <Modal isVisible={this.state.userNameModal}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Update username</Text>
            {this.state.error ? (
              <Text style={styles.modalText}>
                There was an error updating your username. Please try again.
              </Text>
            ) : (
              <Text style={styles.modalText}>
                Type your new desired username below.
              </Text>
            )}
            <TextInput
              placeholder="New username"
              placeholderTextColor="#bfbfbf"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              onChangeText={(newUsername) => this.setState({newUsername})}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={{width: 150}}
                onPress={() => this.setState({userNameModal: false})}
              >
                <Text style={styles.modalButtonCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 150,
                  borderLeftWidth: 1,
                  borderLeftColor: 'gray'
                }}
                onPress={() => this.updateUsername('displayName')}
              >
                <Text style={styles.modalButtonSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
              <Text style={styles.modalText}>
                There was an error updating your email. Please try again.
              </Text>
            ) : (
              <Text style={styles.modalText}>
                Type your new desired email address below.
              </Text>
            )}
            <TextInput
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
                onPress={() => this.setState({emailModal: false})}
              >
                <Text style={styles.modalButtonCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 150,
                  borderLeftWidth: 1,
                  borderLeftColor: 'gray'
                }}
                onPress={() => this.updateEmail('email')}
              >
                <Text style={styles.modalButtonSave}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text></Text>
        {/* user password section */}
        <Text style={styles.userInfo}>password: ****</Text>
        <TouchableOpacity>
          <Text style={styles.userInfo}>Update password?</Text>
        </TouchableOpacity>
        <Text></Text>
        <Text style={styles.userInfo}>Currently, I'm </Text>
        <Text style={styles.userInfo}>
          Select from below to update your role.
        </Text>
        {/* role selection dropdown menu goes here */}
        <TouchableOpacity style={styles.userPageButton}>
          <Text style={styles.buttonText}>contact us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userPageButton}>
          <Text style={styles.buttonText}>log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userPageButton}>
          <Text style={styles.buttonText}>delete</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 100,
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
    borderBottomLeftRadius: 5
  },
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'gray'
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
