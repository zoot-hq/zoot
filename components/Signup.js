import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

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
      <KeyboardAvoidingView keyboardVerticalOffset={280} behavior="padding" style={styles.container}>
        <Text style={styles.title}>après</Text>
        <View style={styles.field}>
          <Text>email</Text>
          <TextInput
            type="email"
            returnKeyType="next"
            onSubmitEditing={() => this.username.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={email => this.setState({ email })}
            ref={input => (this.email = input)}
          />
        </View>
        <View style={styles.field}>
          <Text>username</Text>
          <TextInput
            type="username"
            returnKeyType="next"
            onSubmitEditing={() => this.password.focus()}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={username => this.setState({ username })}
            ref={input => (this.username = input)}
          />
        </View>
        <View style={styles.field}>
          <Text>password</Text>
          <TextInput
            returnKeyType="next"
            secureTextEntry
            onSubmitEditing={() => this.birthday.focus()}
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            ref={input => (this.password = input)}
          />
        </View>
        <View style={styles.field}>
          <Text>birthday</Text>
          <TextInput
            type="birthday"
            returnKeyType="next"
            onSubmitEditing={() => this.city.focus()}
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.input}
            onChangeText={birthday => this.setState({ birthday })}
            ref={input => (this.birthday = input)}
          />
        </View>
        <View style={styles.field}>
          <Text>city</Text>
          <TextInput
            type="city"
            returnKeyType="next"
            onSubmitEditing={() => this.children.focus()}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={city => this.setState({ city })}
            ref={input => (this.city = input)}
          />
        </View>
        <View style={styles.field}>
          <Text>children</Text>
          <TextInput
            type="children"
            returnKeyType="next"
            onSubmitEditing={() => this.monthsPostPartum.focus()}
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={children => this.setState({ children })}
            ref={input => (this.children = input)}
          />
        </View>
        <View style={styles.field}>
          <Text>months post partum</Text>
          <TextInput
            type="monthsPostPartum"
            keyboardType="number-pad"
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={monthsPostPartum => this.setState({ monthsPostPartum })}
            ref={input => (this.monthsPostPartum = input)}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={console.log('signing up', this.state)}
        >
          <Text style={styles.buttonText}>sign me up!</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 50
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  }
});
