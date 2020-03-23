import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Linking, AsyncStorage } from 'react-native';
import Fire from '../Fire';

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      password: '',
      error: false
    };
  }

  render() {

    return (
      <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <View style={styles.container}>
          <Text style={styles.title}>après</Text>
          <View style={styles.field}>
            <Text style={styles.text}>password</Text>
            <TextInput
            returnKeyType='done'
            secureTextEntry
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            onSubmitEditing={async() => {
              const status = await Fire.shared.login(this.props.navigation.state.params.email, this.state.password)

              // if login successful
              if (!status) {
                // navigate into app
                this.props.navigation.navigate('ChatList')
              }
              else {
                this.setState({ error : true })
              }
            }}
            />
          </View>
          {!!this.state.error && (
            <Text style={styles.error}> invalid password </Text>
          )}
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
  error: {
    color: "red",
    fontSize: 10,
    marginBottom: 0,
    fontFamily: "Futura-Light",
    marginRight: 50,
    marginLeft: 50,
  },
  text: {
    fontFamily: "Futura-Light"
  }
});
