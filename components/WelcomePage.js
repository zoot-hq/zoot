import React from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'

export default WelcomePage = props => {
    return (
        <View style={styles.container}>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                 fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
            </Text>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => props.navigation.navigate('ChatList')}>
                <Text style={styles.buttonText}>
                    id est laborum
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      marginRight: 50,
      marginLeft: 50,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      flex: 1
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
    }
  });
  


