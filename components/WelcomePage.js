import React from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'

export default WelcomePage = props => {
    return (
        <View style={styles.container}>
            <Text>
              Welcome to après! {"\n\n"}We are thrilled you are here. This is a community meant to 
              make you feel seen and understood, that relies on users who are candid, kind, and supportive.  
              Trolls will be sent back to 1995, and given a crystal belly button. {"\n\n"} 
              If you have a topic you would like to discuss, feel free to add it. In order to return to the 
              home screen from a chat, swipe right. 
            </Text>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => props.navigation.navigate('ChatList')}>
                <Text style={styles.buttonText}>
                    continue
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
      padding: 10
    }
  });
  


