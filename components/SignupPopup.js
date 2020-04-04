import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const SignupPopup = props => {
    console.log(props)
    let isVisible = props.isVisible
    console.log(isVisible)
    return <View></View>
}

export default SignupPopup

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
    },
    eula: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        textAlign: 'center',
        flex: 0,
        paddingBottom: 50,
    },
    eulaText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 50,
        marginLeft: 50,
        letterSpacing: 1,
        fontFamily: 'Futura-Light',
    },
    link: {
        color: 'blue',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 50,
        marginLeft: 50,
        letterSpacing: 1,
        fontFamily: 'Futura-Light',
    },
    title: {
        top: 0,
        fontSize: 60,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 80,
        fontFamily: 'CormorantGaramond-Light',
    },
    field: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 50,
        marginLeft: 50,
    },
    input: {
        borderBottomWidth: 1,
        marginTop: 10,
        flexGrow: 1,
        textAlignVertical: 'bottom',
        marginLeft: 2,
        fontFamily: 'Futura-Light',
    },
    buttonContainer: {
        borderStyle: 'solid',
        borderWidth: 1,
        paddingVertical: 5,
        marginBottom: 15,
        marginTop: 30,
        marginRight: 50,
        marginLeft: 50,
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '600',
        fontSize: 30,
        fontFamily: 'CormorantGaramond-Light',
    },
    cancel: {
        fontFamily: 'CormorantGaramond-Light',
        textAlign: 'center',
        fontSize: 25,
    },
    error: {
        color: 'red',
        fontSize: 10,
        marginBottom: 0,
        fontFamily: 'Futura-Light',
        marginRight: 50,
        marginLeft: 50,
        marginTop: 10,
    },
    text: {
        fontFamily: 'Futura-Light',
    },
    modal: {
        backgroundColor: 'white',
        paddingVertical: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
})
