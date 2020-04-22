import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { AntDesign, Ionicons, SimpleLineIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Fire from '../Fire';

import { Navigator } from 'react-native';

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// const Stack = createStackNavigator();

// function MyStack() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator>
//                 <Stack.Screen
//                     name="Home"
//                     component={ChatList}
//                 />
//                 <Stack.Screen name="UserPage" component={UserPage} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }


export default class Navbar extends React.Component {

    constructor() {
        super();
        this.state = {
            navbar: true,
        };
    }




    render() {

        console.log('are we in navbar')
        return (


            <Navigator
                renderScene={(route, navigator) =>
    // ...
  }
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={{
                            LeftButton: (route, navigator, index, navState) => { return (<Text>Cancel</Text>); },
                            RightButton: (route, navigator, index, navState) => { return (<Text>Done</Text>); },
                            Title: (route, navigator, index, navState) => { return (<Text>Awesome Nav Bar</Text>); },
                        }}
                        style={{ backgroundColor: 'gray' }}
                    />
                }
            />



            <View style={styles.test}>


                <TouchableOpacity onPress={this.navigation.}>
                    <AntDesign name='home' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.UserPage}>
                    <Feather name='user' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('PMList')}
                >
                    <AntDesign name='contacts' size={30} color='black' />
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={this.liveChat}>
                    <Ionicons name='md-megaphone' size={30} color={this.state.liveChatAvailable ? 'green' : 'black'} />
                </TouchableOpacity> */}

                <TouchableOpacity onPress={this.PartnerChatList}>
                    <AntDesign name='book' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.Resources}>
                    <MaterialIcons name='account-balance' size={30} color='black' />
                </TouchableOpacity>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    test: {
        color: 'black',
        backgroundColor: 'pink',
        fontSize: 12,
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 40,
        paddingRight: 40,
    },
});
