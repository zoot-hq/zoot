import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

export default class SignupScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      city: '',
      birthday: 0-0-0,
      children: 0,
      monthsPostPartum: 0
    };
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>apres</Text>
          <View style={styles.formContainer} />
        </View>
        <TextInput
          type="email"
          placeholder="Email"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={email => this.setState({ email })}
          ref={input => (this.emailInput = input)}
        />
        <TextInput
          type="username"
          placeholder="username"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="string"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={email => this.setState({ email })}
          ref={input => (this.emailInput = input)}
        />
        <TextInput
          placeholder="password"
          placeholderTextColor="black"
          returnKeyType="next"
          secureTextEntry
          style={styles.input}
          onChangeText={password => this.setState({ password })}
          ref={input => (this.passwordInput = input)}
        />
        <TextInput
          type="birthday"
          placeholder="birthday"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="date"
          autoCorrect={false}
          style={styles.input}
          onChangeText={email => this.setState({ birthday })}
          ref={input => (this.emailInput = input)}
        />
        <TextInput
          type="city"
          placeholder="city"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="string"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={email => this.setState({ city })}
          ref={input => (this.emailInput = input)}
        />
         <TextInput
          type="number"
          placeholder="children (number)"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="number"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={children => this.setState({ children })}
          ref={input => (this.emailInput = input)}
        />
        <TextInput
          type="number"
          placeholder="children (number)"
          placeholderTextColor="black"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="string"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          onChangeText={children => this.setState({ monthsPostPartum })}
          ref={input => (this.emailInput = input)}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.signup}
        >
          <Text style={styles.buttonText}>sign me up!</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    width: 250,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    height: 60,
    opacity: 0.5,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 12
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
