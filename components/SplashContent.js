import * as React from 'react';
import * as Font from 'expo-font';
import Fire from '../Fire';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import HomeScreen from './Home';
import { StyleSheet, Text, View, Image } from 'react-native';


export default class SplashContent extends React.Component {
    constructor() {
        super();
        this.state = {
            component: <SplashContent />
        }
    }

    render() {
        console.log('are we in splash content?')
        return (

            < View style={styles.container} >
                <View style={styles.image}>
                    <Image source={require('../assets/Comp-1_1_resize.gif')} style={{ height: 142, width: 230 }} resizeMode="stretch" />
                </View>
                <Text style={styles.subtext}>
                    a safe space {'\n'}
                    for conscious {'\n'}
                    conversation
                    {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}(for testing purposes, swipe back to return)</Text>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1
    },
    image: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        marginBottom: -100,
        marginTop: 100,
    },
    subtext: {
        fontSize: 22,
        fontWeight: "300",
        textAlign: "center",
        marginBottom: 8,
        fontFamily: "Futura-Light",
        marginTop: 5,
        marginLeft: 50,
        marginRight: 50,
        flex: 1
    }
});
