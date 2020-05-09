import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
  Linking,
  Keyboard, 
  TouchableWithoutFeedback
} from 'react-native';
import Fire from '../Fire';
import RNPickerSelect from 'react-native-picker-select';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const roleList = [
  "I'm a New Mother.",
  "I'm a Surrogate.",
  "I'm a Gestational Carrier.",
  "I'm an Adoptive Parent.",
  "I'm a Hopeful Parent.",
  "I'm a Parent.",
  "I'm an Egg/Embryo Donor.",
  "I'n a New Parent.",
  "I'm Parent Recovering from Loss.",
  "I'm an Other Role Not Described Here.",
  "I'd Prefer Not to Disclose."
].map((role) => ({ label: role, value: role }));

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
      error: null,
      selectedRole: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.communityPopup = this.communityPopup.bind(this);
  }

  communityPopup = () => {
    Alert.alert(
      'Community Guidelines',
      `1. Après is intended to be a place of
            acceptance, empathy and compassion Above
            all else, try to be kind.
            2. Think before you type.
            3. If you see something unacceptable, please flag the comment for review.
            4. If you experience a user who repeatedly behaves in an unacceptable manner, please flag the user for review.
            5. If you are struggling in a way that feels overwhelming, please see our resources for access to professional mental healthcare providers, and get help.
            6. We are open and love your feedback. Please send us your suggestions on how to improve your experience.`,
      [{ text: 'OK', onPress: () => this.handleSubmit() }]
    );
  };

  async handleSubmit() {
    // set user info into storage
    await AsyncStorage.setItem('apresLoginEmail', this.state.email);
    await AsyncStorage.setItem('apresLoginPassword', this.state.password);

    // naivgate into app
    this.props.navigation.navigate('CategoryList');
  }

  render() {
    // config for swipe gesture
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <DismissKeyboard>
      <View style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>après</Text>
            <View style={styles.internalcontainer}>
              <View style={styles.field}>
                <Text style={styles.text}>username</Text>
                <TextInput
                  type="username"
                  returnKeyType="next"
                  onSubmitEditing={() => this.password.focus()}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  onChangeText={(username) => this.setState({ username })}
                  ref={(input) => (this.username = input)}
                  blurOnSubmit={false}
                />
              </View>
              {(this.state.error === 'username is required.' && (
                <Text style={styles.error}>{this.state.error}</Text>
              )) ||
                (this.state.error === 'username already taken.' && (
                  <Text style={styles.error}>{this.state.error}</Text>
                )) ||
                (this.state.error ===
                  'username must not contain special characters' && (
                  <Text style={styles.error}>{this.state.error}</Text>
                ))}
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
                  onChangeText={(email) => this.setState({ email })}
                  ref={(input) => (this.email = input)}
                  keyboardType="email-address"
                  blurOnSubmit={false}
                />
              </View>
              {(this.state.error === 'The email address is badly formatted.' ||
                this.state.error ===
                'The email address is already in use by another account.') && (
                  <Text style={styles.error}>{this.state.error}</Text>
                )}
              <View style={styles.field}>
                <Text style={styles.text}>password</Text>
                <TextInput
                  returnKeyType="next"
                  secureTextEntry
                  onSubmitEditing={() => this.birthday.focus()}
                  style={styles.input}
                  onChangeText={(password) => this.setState({ password })}
                  ref={(input) => (this.password = input)}
                  blurOnSubmit={false}
                />
              </View>
              {(this.state.error ===
                'The password must be 6 characters long or more.' ||
                this.state.error ===
                'Password should be at least 6 characters') && (
                  <Text style={styles.error}>{this.state.error}</Text>
                )}
              {/* <View style={styles.field}>
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
                // onSubmitEditing={() => this.children.focus()}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={city => this.setState({ city })}
                ref={input => (this.city = input)}
                blurOnSubmit={false}
              />
            </View> */}
              {/* <View style={styles.field}>
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
            </View> */}
              {/* <View style={styles.field}>
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
            </View> */}
              <View style={styles.roleIdOuterWrap}>
                <Text
                  style={[{ marginTop: 12, alignSelf: 'center' }, styles.text]}
                >
                  {' '}
                  What best describes you?
                  {'\n'}
                </Text>

                <View style={styles.roleIdInnerWrap}>
                  <View>
                    <RNPickerSelect
                      style={{ ...pickerSelectStyles }}
                      onValueChange={(value) => {
                        this.setState({
                          selectedRole: value
                        });
                      }}
                      items={roleList}
                      placeholder={{
                        label: 'Please select...',
                        value: null
                      }}
                    />
                  </View>
                </View>
                {this.state.error === 'please select a role.' && (
                  <Text style={styles.error}>{this.state.error}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={async () => {
                  // ensure a username is chosen
                  if (!this.state.username.length) {
                    this.setState({
                      error: 'username is required.'
                    });
                    return;
                  }
                  if (!this.state.selectedRole.length) {
                    this.setState({
                      error: 'please select a role.'
                    });
                    return;
                  }
                  // sign up a user
                  const status = await Fire.shared.signup(
                    this.state.email,
                    this.state.password,
                    this.state.username,
                    this.state.birthday,
                    this.state.city,
                    this.state.children,
                    this.state.monthsPostPartum,
                    this.state.selectedRole
                  );
                  // if error occured, put it on state
                  if (status) {
                    this.setState({ error: status.message });
                  }
                  // if everything is good
                  else {
                    this.communityPopup();
                  }
                }}
              >
                <Text style={styles.buttonText}>sign up</Text>
              </TouchableOpacity>


              <View style={styles.eula}>
                <Text style={styles.eulaText}>
                  By proceeding with signing in and clicking 'sign up', you
                  agree to our terms as listed in our
                
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
    marginBottom: 20,
    marginTop: -25,
    fontFamily: 'CormorantGaramond-Light'
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    marginBottom: 10
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
    marginBottom: 0,
    marginTop: 40,
    marginRight: 50,
    marginLeft: 50,
    paddingBottom: 15
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 40,
    fontFamily: 'Futura-Light'
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginBottom: 0,
    fontFamily: 'Futura-Light',
    marginRight: 50,
    marginLeft: 50
  },
  text: {
    fontFamily: 'Futura-Light',
    fontSize: 22
  },
  modal: {
    paddingVertical: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  guidelinesText: {
    fontFamily: 'Futura-Light',
    marginBottom: 10,
    fontSize: 12
  },
  guidelinesTitle: {
    fontFamily: 'Futura-Light',
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  okButtonView: {
    backgroundColor: 'pink',
    display: 'flex',
    alignSelf: 'flex-end',
    position: 'relative'
  },
  okButtonOpacity: {
    paddingBottom: 10,
    paddingTop: 10,
    borderTopColor: 'grey',
    borderTopWidth: 3,
    position: 'absolute'
  },
  okButtonText: {
    fontFamily: 'Futura-Light',
    textAlign: 'center',
    fontSize: 24,
    color: 'blue'
  },
  roleIdOuterWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  roleIdInnerWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    width: 180
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
    color: 'black',
    fontFamily: 'Futura-Light',
    width: 300
  }
});
