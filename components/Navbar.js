import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import {
    AntDesign, Ionicons, SimpleLineIcons, Feather, MaterialIcons, MaterialCommunityIcons
} from '@expo/vector-icons';
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




            <View>
                <View style={styles.navbar}>


                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ChatList')}
                    >
                        <AntDesign name='home' size={30} color='black' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('UserPage')}
                    >
                        <AntDesign name="user" size={30} color="black"></AntDesign>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('PMList')}
                    >
                        <AntDesign name='message1' size={30} color='black' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('liveChat')}
                    >
                        <Ionicons name='md-megaphone' size={30} color='black' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('PartnerChatList')}
                    >
                        <MaterialIcons name='account-balance' size={30} color='black' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Resources')}
                    >
                        <AntDesign name='book' size={30} color='black' />
                    </TouchableOpacity>

                </View>

                <View style={styles.notifications}>
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color='transparent' />
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color='transparent' />
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color='black' />
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color={this.state.liveChatAvailable ? 'green' : 'transparent'} />
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color='transparent' />
                    <MaterialCommunityIcons name='checkbox-blank-circle' size={10} color='transparent' />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    navbar: {
        color: 'black',
        backgroundColor: 'white',
        fontSize: 12,
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 20,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 40,
        paddingRight: 40,
    },
    notifications: {
        color: 'black',
        backgroundColor: 'white',
        fontSize: 12,
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 20,
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 40,
        paddingRight: 40,
    },
});
