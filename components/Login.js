import React from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.title}>après</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          returnKeyType="go"
          secureTextEntry
          style={styles.input}
          onChangeText={password => this.setState({ password })}
          ref={input => (this.passwordInput = input)}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={console.log('logging in')}
        >
          <Text style={styles.buttonText}>log back in!</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginRight: 20,
    marginLeft: 20,
    justifyContent: 'center',
  },
  title: {
    top: 0,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 10
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 80
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  }
});
