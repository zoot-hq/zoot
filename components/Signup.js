import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Fire from '../Fire';

export default class SignupScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      city: '',
      birthday: '000000000',
      children: '0',
      monthsPostPartum: '0',
      error: null
    };
  }

  render() {

    // config for swipe gesture
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>après</Text>
          <View style={styles.field}>
            <Text style={styles.text}>username</Text>
            <TextInput
              type="username"
              returnKeyType="next"
              onSubmitEditing={() => this.password.focus()}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              onChangeText={username => this.setState({ username })}
              ref={input => (this.username = input)}
              blurOnSubmit={false}
            />
          </View>
          {(this.state.error==='username is required.' || this.state.error==='username already taken.')&& (
            <Text style={styles.error}>{this.state.error}</Text>
          )}
          <View style={styles.field}>
            <Text style={styles.text}>email</Text>
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
              keyboardType="email-address"
              blurOnSubmit={false}
            />
          </View>
          {(this.state.error==='The email address is badly formatted.' ||
            this.state.error==='The email address is already in use by another account.')&& (
            <Text style={styles.error}>{this.state.error}</Text>
          )}
          <View style={styles.field}>
            <Text style={styles.text}>password</Text>
            <TextInput
              returnKeyType="next"
              secureTextEntry
              onSubmitEditing={() => this.birthday.focus()}
              style={styles.input}
              onChangeText={password => this.setState({ password })}
              ref={input => (this.password = input)}
              blurOnSubmit={false}
            />
          </View>
          {(this.state.error==='The password must be 6 characters long or more.' || 
            this.state.error==='Password should be at least 6 characters') && (
            <Text style={styles.error}>{this.state.error}</Text>
          )}
          <View style={styles.field}>
            <Text style={styles.text}>birthday (ddmmyyyy)</Text>
            <TextInput
              type="birthday"
              returnKeyType="next"
              onSubmitEditing={() => this.city.focus()}
              autoCorrect={false}
              style={styles.input}
              onChangeText={birthday => this.setState({ birthday })}
              ref={input => (this.birthday = input)}
              keyboardType="number-pad"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.text}>city</Text>
            <TextInput
              type="city"
              returnKeyType="next"
              onSubmitEditing={() => this.children.focus()}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              onChangeText={city => this.setState({ city })}
              ref={input => (this.city = input)}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.text}>children (number)</Text>
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
              keyboardType="number-pad"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.text}>months post partum</Text>
            <TextInput
              type="monthsPostPartum"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              onChangeText={monthsPostPartum => this.setState({ monthsPostPartum })}
              keyboardType="number-pad"
              ref={input => (this.monthsPostPartum = input)}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={async () => {

              // ensure a username is chosen
              if (!this.state.username.length) {
                this.setState({ error: 'username is required.'})
                return
              }

              // sign up a user
              const status = await Fire.shared.signup
              (
                this.state.email, 
                this.state.password, 
                this.state.username,
                this.state.birthday,
                this.state.city,
                this.state.children,
                this.state.monthsPostPartum
              )
              
              // if error occured, put it on state
              if (status) {
                console.log('error message: ', status)
                this.setState({ error: status.message})
              }

              // if everything is good, navigate into the app
              else {
                this.props.navigation.navigate('WelcomePage')
              }  
            }}
          >
            <Text style={styles.buttonText}>sign me up!</Text>
          </TouchableOpacity>
        </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginRight: 50,
    marginLeft: 50,
    justifyContent: 'center',
    marginTop: 70
  },
  title: {
    top: 0,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: "CormorantGaramond-Light"
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
    marginLeft: 2,
    fontFamily: "Futura-Light"
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
    fontFamily: "CormorantGaramond-Light"
  },
  error: {
    color: "red",
    fontSize: 10,
    marginBottom: 0,
    fontFamily: "Futura-Light"
  },
  text: {
    fontFamily: "Futura-Light"
  }
});
