import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import Fire from '../Fire';
import { MaterialIndicator } from 'react-native-indicators';

export default class PMList extends React.Component {
  constructor(){
    super()
    this.state = ({
      chatrooms: [],
      grabbed: false
    })
  }

  componentWillMount(){
    //grab chatrooms
    Fire.shared.getPMRooms((room => {
      this.setState({
        chatrooms: [...this.state.chatrooms, room],
        grabbed: true
      })
  }));
  }

  getRoomName(name) {
    const currentUser = Fire.shared.username()
    const names = name.split('-')
    if (names[0] === currentUser){
        return names[1]
    }
    else if (names[1] === currentUser) {
        return names[0]
    }
  }
    
  render() {
    if (!this.state.grabbed) {
      return (<MaterialIndicator color='black' />)

    }
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          
          {/* titles */}
          <Text style={styles.title}>après</Text>
          <Text style={styles.subtitle}>
              When you start a private message with another user, it will appear here. 
              To get started, navigate back to the main page, click on a chatlist, and longpress 
              on a user's name. A new chat will then open up between you and that user, and it will 
              also appear on this list. Happy chatting!
          </Text>

          <KeyboardAvoidingView behavior="padding">
            <SafeAreaView >
              <ScrollView contentContainerStyle={{flexGrow:1}}>
  
                {(this.state.chatrooms.length?
                  (this.state.chatrooms.map(chatroom => (
                    !!chatroom ?
                    <TouchableOpacity 
                      key={chatroom} 
                      style={styles.buttonContainer}
                      onPress={() => this.props.navigation.navigate('ChatRoom', { chatroom })}
                      >
                    <Text style={styles.buttonText}># {this.getRoomName(chatroom)}</Text>
                   </TouchableOpacity>
                    : null)))
                    : null)
                }
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  container: {
    display: 'flex',
    marginRight: 20,
    marginLeft: 20,
    justifyContent: 'center',
    marginTop: 50,
  },
  title: {
    top: 15,
    bottom: 15,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: "CormorantGaramond-Light"
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: "Futura-Light",
    marginTop: 10
  },
  buttonContainer: {
    borderStyle: 'solid', 
    borderWidth: 1,
    paddingVertical: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 28,
    fontFamily: "Futura-Light"
  },
  searchbar: {
    color: 'black',
    marginBottom: 20,
    fontFamily: "Futura-Light"
  }
});