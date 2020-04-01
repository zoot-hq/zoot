import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Linking, AsyncStorage, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Fire from '../Fire';

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: false,
      showResetPasswordForm: false,
      resetPasswordError: false,
    }
  }

  resetPassword = async () => {
    try {

      // try to send password reset email
      await Fire.shared.sendPasswordResetEmail(this.state.email)
      
      // send alert if successful
      Alert.alert(
        'Password Reset',
        `An email has been sent to ${this.state.email} with further instructions on how to reset your password.`,
        [
          {text: 'Ok, great!', onPress: () => this.setState({ showResetPasswordForm : false })}
        ]
      )
    } catch (error) {
      this.setState({ resetPasswordError : true})    
    }
  }

  render() {

    return (
      <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <View style={styles.container}>
          <Text style={styles.title}>après</Text>
          <View style={styles.field}>
            <Text style={styles.text}>email</Text>
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
            <Text style={styles.text}>password</Text>
            <TextInput
            returnKeyType="done"
            secureTextEntry
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            blurOnSubmit={false}
            ref={input => (this.passwordInput = input)}
          />
          </View>
          {!!this.state.error && (
            <TouchableOpacity onPress = {() => this.setState({ showResetPasswordForm : true })}>
              <Text style={styles.error}> invalid login credentials - click here to reset your password </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={ async() => {
              const status = await Fire.shared.login(this.state.email, this.state.password)

              // if login successful
              if (!status) {

                // set user info into storage
                await AsyncStorage.setItem('apresLoginEmail', this.state.email)
                await AsyncStorage.setItem('apresLoginPassword', this.state.password)

                // navigate into app
                this.props.navigation.navigate('ChatList')
              }
              else {
                this.setState({ error : true })
              }
            }}
          >
            <Text style={styles.buttonText}>log back in!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.eula}>
            <Text style={styles.eulaText}>By proceeding with logging in and clicking 'Log back in!', you agree to our terms as listed in our</Text>
            <Text style={styles.link}
              onPress={() => Linking.openURL('http://gist.githubusercontent.com/lisjak/5196333df14d1f708563804a885a1b66/raw/8ed9e754f8cbddd156472f02487ef8bcf4ef52ff/apres-eula')}>
              End-User License Agreement (EULA) of Après.
          </Text>
        </View>

        {/* password reset form - visible only when showResetPasswordForm on state is set to true */}
        <View>
          <Modal isVisible={this.state.showResetPasswordForm}>
            <View style={styles.modal}>
              <View style={styles.field}>
                <Text style={styles.text}>email</Text>
                <TextInput
                returnKeyType="done"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={email => this.setState({ email })}
                />
              </View>
              {!!this.state.resetPasswordError && (
                <TouchableOpacity>
                  <Text style={styles.error}> email not found </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.buttonContainer} onPress={this.resetPassword}>
                <Text style={styles.buttonText}>reset password</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ showResetPasswordForm : false })}>
                <Text style={styles.cancel}>cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
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
  eula: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    textAlign: 'center',
    flex: 0,
    paddingBottom: 50,
  },
  eulaText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    letterSpacing: 1,
    fontFamily: "Futura-Light",
  },
  link: {
    color: 'blue',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    letterSpacing: 1,
    fontFamily: "Futura-Light"
  },
  title: {
    top: 0,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 80,
    fontFamily: "CormorantGaramond-Light"
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
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
    marginTop: 30,
    marginRight: 50,
    marginLeft: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
    fontFamily: "CormorantGaramond-Light"
  },
  cancel: {
    fontFamily: "CormorantGaramond-Light",
    textAlign: 'center',
    fontSize: 25,
  },
  error: {
    color: "red",
    fontSize: 10,
    marginBottom: 0,
    fontFamily: "Futura-Light",
    marginRight: 50,
    marginLeft: 50,
    marginTop: 10
  },
  text: {
    fontFamily: "Futura-Light"
  },
  modal : { 
    backgroundColor: 'white', 
    paddingVertical: 50, 
    borderRadius: 10,
    paddingHorizontal: 10
  }
});
