import * as React from 'react';
import * as Font from 'expo-font';
import Fire from '../Fire';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import HomeScreen from './Home';
import SplashContent from './SplashContent';
import { StyleSheet, Text, View, Image } from 'react-native';
import ChatList from './ChatList';


export default class Splash extends React.Component {
    constructor() {
        super();
        this.state = {
            component: <SplashContent />
        }
    }

    async componentWillMount() {
        // get fonts
        await Font.loadAsync({
            'CormorantGaramond-Light': require('../assets/fonts/CormorantGaramond-Light.ttf'),
            'Futura-Light': require('../assets/fonts/FuturaLight.ttf')
        });

        // await Image.loadAsync({

        // })
    }



    componentDidMount() {

        // Start counting when the page is loaded
        this.timeoutHandle = setTimeout(() => {
            // Add your logic for the transition
            this.setState({ component: <ChatList /> })
        }, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    render() {
        return (
            this.state.component
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
