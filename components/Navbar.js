import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';

import { MaterialIndicator } from 'react-native-indicators';
import { Ionicons } from '@expo/vector-icons';



const Navbar = () => {
    return (
        <Text styles="navbar">Navbar goes here</Text>

    );
    console.log('navbarrrr')

}

const styles = StyleSheet.create({
    navbar: {
        fontSize: 120,
        color: 'black',
    }
});


export default Navbar;