import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
export default class HomeScreen extends React.Component {
  constructor(){
    super()
    this.state = {
      readyToLoad : false
    }
    this.componentWillMount = this.componentWillMount.bind(this)
  }

  async componentWillMount() {
    // get fonts
    await Font.loadAsync({
      'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf'),
      'Futura-Light': require('../assets/fonts/FuturaLight.ttf')
    });

    // navigate to seamless login if neccessary
    const apresLoginEmail = await AsyncStorage.getItem('apresLoginEmail')
    if (apresLoginEmail) this.props.navigation.replace('SeamlessLogin', {email: apresLoginEmail})

    else this.setState({
      readyToLoad : true
    })
  }
  render() {
    if (!this.state.readyToLoad) {
      return null
    }
    return (
      <View style={styles.container}>
        {/* title */}
        <Text style={styles.title}>après</Text>

        {/* log in button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.buttonText}>log in</Text>
        </TouchableOpacity>

        {/* sign up button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('Signup')}>
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
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: "CormorantGaramond-Light"
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 15,
    marginRight: 50,
    marginLeft: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
    fontFamily: "CormorantGaramond-Light"
  }
});