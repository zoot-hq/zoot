import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import * as Font from 'expo-font';
import Fire from '../Fire';

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      readyToLoad: false
    };
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  async componentWillMount() {
    // get fonts
    await Font.loadAsync({
      'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf'),
      'Futura-Light': require('../assets/fonts/FuturaLight.ttf'),
      'Futura-Medium': require('../assets/fonts/FuturaMedium.ttf')
    });

    // attempt to login user in
    const apresLoginEmail = await AsyncStorage.getItem('apresLoginEmail');
    const apresLoginPassword = await AsyncStorage.getItem('apresLoginPassword');
    const status = await Fire.shared.login(apresLoginEmail, apresLoginPassword);

    // if successful login, navigate in
    if (!status) {
      this.props.navigation.navigate('CategoryList');
    }

    // else navigate to regular login
    else this.setState({ readyToLoad: true });
  }
  render() {
    if (!this.state.readyToLoad) {
      return null;
    }
    return (
      <View style={styles.container}>
        {/* title */}
        <Text style={styles.title}>après</Text>

        {/* log in button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>log in</Text>
        </TouchableOpacity>

        {/* sign up button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>sign up</Text>
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
    flex: 1
  },
  title: {
    fontSize: 120,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: -100,
    fontFamily: 'CormorantGaramond-Light'
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 0,
    paddingVertical: 5,
    marginBottom: 15,
    marginRight: 50,
    marginLeft: 50
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 40,
    fontFamily: 'Futura-Light'
  }
});
