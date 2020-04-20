import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Fire from '../Fire';
import firebase from 'firebase';

export default class UserPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>après</Text>
        <Text style={styles.subtitle}>
          Hey, {Fire.shared.username()}! This is your very own user page! Update
          your information here.
        </Text>
        <Text style={styles.username}>{Fire.shared.username()}</Text>
        <Text style={styles.userInfo}>username: {Fire.shared.username()}</Text>
        <TouchableOpacity>
          <Text style={styles.userInfo}>Update username?</Text>
        </TouchableOpacity>
        <Text></Text>
        <Text style={styles.userInfo}>email: {Fire.shared.email()}</Text>
        <TouchableOpacity>
          <Text style={styles.userInfo}>Update email?</Text>
        </TouchableOpacity>
        <Text></Text>
        <Text style={styles.userInfo}>password: ****</Text>
        <TouchableOpacity>
          <Text style={styles.userInfo}>Update password?</Text>
        </TouchableOpacity>
        <Text></Text>
        <Text style={styles.userInfo}>Currently, I'm </Text>
        <Text style={styles.userInfo}>
          Select from below to update your role.
        </Text>
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
    flex: 1,
  },
  title: {
    fontSize: 100,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 15,
    fontFamily: 'CormorantGaramond-Light',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Futura-Light',
    marginTop: 10,
    marginLeft: 50,
    marginRight: 50,
  },
  username: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Futura-Light',
    marginTop: 10,
  },
  userInfo: {
    fontSize: 17,
    fontWeight: '300',
    marginBottom: 2,
    fontFamily: 'Futura-Light',
    marginTop: 2,
    marginLeft: 30,
    marginRight: 30,
  },
  userPageButton: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    width: 200,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    fontFamily: 'Futura-Light',
    fontSize: 25,
    textAlign: 'center',
  },
});
