import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  AsyncStorage,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Modal from 'react-native-modal';
import Fire from '../Fire';


const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: false,
      showResetPasswordForm: false,
      resetPasswordError: false
    };
  }



  resetPassword = async () => {
    try {
      // try to send password reset email
      await Fire.shared.sendPasswordResetEmail(this.state.email);

      // send alert if successful
      Alert.alert(
        'Password Reset',
        `An email has been sent to ${this.state.email} with further instructions on how to reset your password.`,
        [
          {
            text: 'Got it!',
            onPress: () => this.setState({ showResetPasswordForm: false })
          }
        ]
      );
    } catch (error) {
      this.setState({ resetPasswordError: true });
    }
  };



  render() {
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={styles.container}>
              <Text style={styles.title}>après</Text>
              <View style={styles.field}>
                <Text style={styles.text}>email</Text>
                <TextInput
                  type="email"
                  returnKeyType="next"
                  onSubmitEditing={() => this.passwordInput.focus()}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  onChangeText={(email) => this.setState({ email })}
                  blurOnSubmit={false}
                />

              </View>
              <View style={styles.internalcontainer}>
                <View style={styles.field}>
                  <Text style={styles.text}>password</Text>
                  <TextInput
                    returnKeyType="done"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={(password) => this.setState({ password })}
                    blurOnSubmit={false}
                    ref={(input) => (this.passwordInput = input)}
                  />
                </View>
                <TouchableOpacity onPress={() => this.setState({ showResetPasswordForm: true })}>
                  <Text style={styles.forgot}>
                    Forgot your password? Click here. </Text>
                </TouchableOpacity>
                {!!this.state.error && (
                  <TouchableOpacity
                    onPress={() => this.setState({ showResetPasswordForm: true })}
                  >
                    <Text style={styles.error}>
                      {' '}
                  Invalid login credentials - click here to reset your password.{' '}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={async () => {
                    const status = await Fire.shared.login(
                      this.state.email,
                      this.state.password
                    );

                    // if login successful
                    if (!status) {
                      // set user info into storage
                      await AsyncStorage.setItem(
                        'apresLoginEmail',
                        this.state.email
                      );
                      await AsyncStorage.setItem(
                        'apresLoginPassword',
                        this.state.password
                      );

                      // navigate into app
                      this.props.navigation.navigate('CategoryList');
                    } else {
                      this.setState({ error: true });
                    }
                  }}
                >

                  <Text style={styles.buttonText}>log in</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.eula}>
                <Text style={styles.eulaText}>
                  By proceeding with logging in and clicking 'log in', you agree to
                  our terms as listed in our
              <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL(
                        'http://gist.githubusercontent.com/lisjak/5196333df14d1f708563804a885a1b66/raw/8ed9e754f8cbddd156472f02487ef8bcf4ef52ff/apres-eula'
                      )
                    }
                  >
                    {' '}
                End-User License Agreement (EULA) of Après.
              </Text>
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
                        onChangeText={(email) => this.setState({ email })}
                      />
                    </View>
                    {!!this.state.resetPasswordError && (
                      <TouchableOpacity>
                        <Text style={styles.error}> email not found </Text>
                      </TouchableOpacity>
                    )}
                    <View
                    // style={styles.formButtonContainer}
                    >
                      <TouchableOpacity
                        style={styles.buttonContainer2}
                        onPress={this.resetPassword}
                      >
                        <Text style={styles.formButtonText}>reset password</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.formButtonContainer}>
                      <TouchableOpacity
                        onPress={() => this.setState({ showResetPasswordForm: false })}
                      >
                        <Text style={styles.formButtonText}>cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>

            </View>
          </KeyboardAvoidingView>
        </View>
      </DismissKeyboard>
    );
  }
}
const styles = StyleSheet.create({
  internalContainer: {
    marginLeft: 30,
    marginRight: 30
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1
  },
  eula: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    textAlign: 'justify',
    flex: 0,
    paddingBottom: 10
  },
  eulaText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    letterSpacing: 0,
    fontFamily: 'Futura-Light',
    textAlign: 'center',
    lineHeight: 15
  },
  link: {
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    letterSpacing: 0,
    fontFamily: 'Futura-Light',
    textAlign: 'center'
  },
  title: {
    fontSize: 120,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: -100,
    fontFamily: 'CormorantGaramond-Light'
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    marginBottom: 20
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 10,
    flexGrow: 1,
    textAlignVertical: 'bottom',
    marginLeft: 2,
    fontFamily: 'Futura-Light',
    fontSize: 22
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 0,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 40,
    marginRight: 50,
    marginLeft: 50
  },
  buttonContainer2: {
    borderStyle: 'solid',
    borderWidth: 0,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 20,
    marginRight: 50,
    marginLeft: 50
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 40,
    fontFamily: 'Futura-Light'
  },
  formButtonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 40,
    fontFamily: 'Futura-Light',
    borderTopWidth: 10,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  formButtonContainer: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightgray',
    paddingTop: 15,
    paddingBottom: 0,
  },
  cancel: {
    fontFamily: 'CormorantGaramond-Light',
    textAlign: 'center',
    fontSize: 25
  },
  error: {
    color: 'red',
    fontSize: 15,
    marginBottom: 0,
    fontFamily: 'Futura-Light',
    marginRight: 50,
    marginLeft: 50,
    marginTop: 10,
    textAlign: 'center'
  },
  forgot: {
    color: 'black',
    fontSize: 20,
    marginBottom: 0,
    fontFamily: 'Futura-Light',
    marginRight: 50,
    marginLeft: 50,
    marginTop: 10,
    textAlign: 'center'
  },
  text: {
    fontFamily: 'Futura-Light',
    fontSize: 22
  },
  modal: {
    backgroundColor: 'white',
    paddingVertical: 50,
    borderRadius: 10,
    paddingHorizontal: 10
  }
});
