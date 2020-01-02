import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
export default class HomeScreen extends React.Component {
  constructor(){
    super()
    this.state = {
      fontLoaded : false
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf'),
      'Futura-Light': require('../assets/fonts/FuturaLight.ttf')
    });

    this.setState({
      fontLoaded : true
    })
  }
  render() {
    if (!this.state.fontLoaded) {
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
    marginRight: 50,
    marginLeft: 50,
    justifyContent: 'center',
    marginTop: 150,
  },
  title: {
    top: 0,
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
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
    fontFamily: "CormorantGaramond-Light"
  }
});