import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Fire from '../Fire';
import { MaterialIndicator } from 'react-native-indicators';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from 'react-navigation';


const Navbar = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="home" size={25} color={tintColor} />
                )
            }
        },
        Explore: {
            screen: ExploreScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="comments" size={25} color={tintColor} />
                )
            }
        },
        Notifications: {
            screen: NotificationsScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="search" size={25} color={tintColor} />
                )
            }
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="user" size={25} color={tintColor} />
                )
            }
        },
    },
    {
        initialRouteName: 'Home',
        tabBarOptions: {
            activeTintColor: '#eb6e3d'
        }
    }
);

export default class Navbar extends React.Component {
    constructor() {
        super()
    }


    render() {
        return (
            <View style={styles.container}>
                {Navbar}
            </View>
        )
    }
}


const styles = StyleSheet.create({

    navbar: {
        height: 10,
    }
})
