import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default class HomeScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
          {/* title */}
        <View>
          <Text
            style={styles.title}>apres
          </Text>
        </View>

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
    flex: 1,
    padding: 50,
  },
  title: {
    marginTop: 10,
    width: 250,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
