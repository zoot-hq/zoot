import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';

import { MaterialIndicator } from 'react-native-indicators';
import {

    AntDesign,
    Ionicons,
    SimpleLineIcons,
    Feather,
    MaterialIcons
} from '@expo/vector-icons';


class Navbar extends React.Component {
    render() {
        console.log('are we in navbar')
        return (
            <View style={styles.test}>


                <TouchableOpacity onPress={() => => navigation.navigate('ChatList')}>
                    <AntDesign name='home' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('PMList')}>
                    <Feather name='user' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('PMList')}>
                    <AntDesign name='contacts' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('PMList')}>
                    <Ionicons name='md-megaphone' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('PMList')}>
                    <AntDesign name='book' size={30} color='black' />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('PMList')}>
                    <MaterialIcons name='account-balance' size={30} color='black' />
                </TouchableOpacity>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    test: {
        color: 'black',
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

export default Navbar;