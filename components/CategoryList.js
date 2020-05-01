import React, { Component } from 'react';
import {
    Text,
    TextInput,
    Alert,
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MaterialIndicator } from 'react-native-indicators';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import Fire from '../Fire';
import {
    StackActions,
    NavigationActions,
    withNavigation
} from 'react-navigation';
import * as MailComposer from 'expo-mail-composer';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell
} from 'react-native-confirmation-code-field';

import Modal from 'react-native-modal';

import BookmarkIcon from '../assets/icons/BookmarkIcon';
import HelpIcon from '../assets/icons/HelpIcon';

import Navbar from './Navbar';


export class CategoryList extends Component {
    constructor() {
        super();
        this.state = {
            categoryNames: [],
            categoryName: '',
            passcodes: [],
            queriedcategorys: [],
            query: '',
            selectedcategoryChatrooms: {},
            currentCategory: {},
            currentUserName: firebase.auth().currentUser.displayName,
        };
    }

    async componentDidMount() {






        // help alert
        this.helpAlert = () => {
            Alert.alert(
                'Help',
                'Hey there! \n\n Après is proud to category with our organizations. \n\nUsers can privately interact with categoryed organizations on Après by requesting a secret access code from the real - world organizations which they belong to.',
                [{ text: 'Got it!' }]
            );
        };

        // bookmark alert
        this.bookmark = () => {
            Alert.alert(
                'Bookmarks coming soon!',
                'Bookmarked boards are in the works. Hang tight!',
                [{ text: 'OK!' }]
            );
        };


        try {
            let categorys = await this.getcategoryNames();
            this.setState({ categoryNames: Object.values(categorys) });
        } catch (error) {
            console.error(error);
        }
    }



    async getcategoryNames() {
        let ref = firebase.database().ref(`categoryNames`);
        try {
            let query = await ref.once('value').then(function (snapshot) {
                return snapshot.val();
            });
            return query;
        } catch (error) {
            console.error(error);
        }
    }

    resetNavigation() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'ChatList' })]
        });
        this.props.navigation.dispatch(resetAction);
    }






    render() {



        setCurrentCategory = (category) => {
            this.setState({ currentCategory: category });


        }


















        return (
            <View style={styles.container}>
                <View style={styles.innerView}>

                    {/* bookmark button */}
                    <View style={styles.help}>
                        <TouchableOpacity onPress={() => this.bookmark()}>
                            <BookmarkIcon />
                        </TouchableOpacity>

                        {/* help button */}

                        <TouchableOpacity onPress={() => this.helpAlert()}>

                            <HelpIcon />
                        </TouchableOpacity>
                    </View>

                    {/* titles */}
                    {/* <Text style={styles.title}>après</Text> */}
                    <Text style={styles.subtitle2}>
                        categories
          </Text>
                </View>
                <View style={styles.searchView}>
                    {/* <Searchbar 
                        theme={{ colors: { primary: 'black' } }}
                        placeholder="Search for a categoryed organization"
                        onChangeText={(query) => {
                            const queriedcategorys = this.state.categoryNames.filter(
                                (category) => {
                                    return category.name
                                        .toLowerCase()
                                        .includes(query.toLowerCase());
                                }
                            );
                            this.setState({ queriedcategorys, query });
                            if (!query.length) {
                                this.setState({ queriedcategorys: this.state.categoryNames });
                            }
                        }}
                    /> */}


                    {/* category board list */}
                    <KeyboardAvoidingView style={styles.chatroomlist} behavior="padding">
                        <SafeAreaView>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>





                                {/* if a query made, queried chatrooms displayed
                                {this.state.queriedcategorys.length ? (
                                    this.state.queriedcategorys.map((category, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.buttonContainer}
                                        //onPress ={() =>
                                        //   this.props.navigation.navigate('ChatRoom', {
                                        //     chatroom: chatroom.name
                                        //   })
                                        // }
                                        >
                                            <View style={styles.singleChatView}>
                                                <Text style={styles.buttonText}># {category.name}</Text>
                                                <Ionicons name="md-people" size={25} color="grey">
                                                    {' '}
                                                </Ionicons>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : // else if a search has not run but the list of categorys isn't empty, display all categorys */}






                                {/* {this.state.categoryNames.length ? ( */}

                                {this.state.categoryNames.slice(0).reverse().map((category) => (


                                    <View key={category.name}>






                                        <TouchableOpacity
                                            key={category.name}
                                            style={styles.buttonContainer}
                                            onPress={() => {
                                                setCurrentCategory(category);
                                                this.resetNavigation();
                                                this.props.navigation.navigate('ChatList', {
                                                    category: category.name

                                                })
                                            }
                                            }
                                        >



                                            <View style={styles.singleChatView}>
                                                <Text style={styles.buttonText}>
                                                    {' -- '}
                                                </Text>


                                                <Text style={styles.buttonText}>
                                                    {`${category.name}`}</Text>

                                            </View>
                                        </TouchableOpacity>







                                    </View>
                                ))}

                            </ScrollView>
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                </View>

                <Navbar />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    help: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginTop: -30,
        marginBottom: 20,
        height: 20,
        zIndex: 999
    },
    chatroomlist: {
        marginBottom: 30,
        height: 500
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        flex: 1
    },
    searchView: {
        marginTop: 0,
        marginRight: 20,
        marginLeft: 20,
        flex: 5
    },
    innerView: {
        marginTop: 50,
        marginRight: 20,
        marginLeft: 20,
        flex: 1
    },
    title: {
        bottom: 10,
        fontSize: 120,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 15,
        fontFamily: 'CormorantGaramond-Light',
        marginTop: -15
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '300',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'Futura-Light',
        marginTop: 10
    },
    subtitle2: {
        fontSize: 40,
        fontWeight: '300',
        textAlign: 'center',
        letterSpacing: -1,
        marginBottom: 15,
        fontFamily: 'CormorantGaramond-Light',
        marginTop: 10
    },
    buttonContainer: {
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 5,
        marginTop: 5,
        marginLeft: 5
    },
    buttonText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 28,
        fontFamily: 'Futura-Light'
    },
    searchbar: {
        color: 'black',
        marginBottom: 20
    },
    numOnline: {
        fontSize: 20,
        fontFamily: 'Futura-Light'
    },
    singleChatView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    testingView: {
        borderColor: 'red',
        borderStyle: 'dashed',
        borderWidth: 1,
        margin: 10
    },
    modal: {
        backgroundColor: 'whitesmoke',
        borderRadius: 10,
        width: 300,
        alignSelf: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20
    },
    modalText: {
        fontSize: 15,
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    input: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
        borderLeftWidth: 0.5,
        borderLeftColor: 'gray',
        borderRightWidth: 0.5,
        borderRightColor: 'gray',
        borderTopWidth: 0.5,
        borderTopColor: 'gray',
        backgroundColor: 'white',
        padding: 5,
        marginVertical: 20,
        flexGrow: 1,
        textAlignVertical: 'bottom',
        marginLeft: 15,
        marginRight: 15,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        minHeight: 30
    },
    modalButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'gray'
    },
    deleteModalButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'gray',
        marginTop: 15
    },
    modalButtonCancel: {
        color: '#0073e6',
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10
    },
    modalButtonSave: {
        color: '#0073e6',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 10
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFiledRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center'
    },
    focusCell: {
        borderColor: '#000'
    }
});

export default withNavigation(CategoryList);
