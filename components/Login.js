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
        <View style={styles.field}>
          <Text>email</Text>
          <TextInput
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={email => this.setState({ email })}
        />
        </View>
        <View style={styles.field}>
          <Text>password</Text>
          <TextInput
          returnKeyType="done"
          secureTextEntry
          style={styles.input}
          onChangeText={password => this.setState({ password })}
          ref={input => (this.passwordInput = input)}
        />
        </View>
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
    marginRight: 50,
    marginLeft: 50,
    justifyContent: 'center',
  },
  title: {
    top: 0,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 10,
    flexGrow: 1,
    textAlignVertical: 'bottom',    
    marginLeft: 2
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 30
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
  }
});
