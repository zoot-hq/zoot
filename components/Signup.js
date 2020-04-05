import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    AsyncStorage,
} from 'react-native'
import Fire from '../Fire'
import Modal from 'react-native-modal'

export default class SignupScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            username: '',
            password: '',
            city: '',
            birthday: '000000000',
            children: '0',
            monthsPostPartum: '0',
            error: null,
            // visibility state for community guidelines popup
            showCommunityPopup: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit() {
        this.setState({ showCommunityPopup: false })
        // set user info into storage
        await AsyncStorage.setItem('apresLoginEmail', this.state.email)
        await AsyncStorage.setItem('apressLoginPassword', this.state.password)

        // naivgate into app
        this.props.navigation.navigate('WelcomePage')
    }

    render() {
        // config for swipe gesture
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
        }
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Text style={styles.title}>après</Text>
                        <View style={styles.field}>
                            <Text style={styles.text}>username</Text>
                            <TextInput
                                type="username"
                                returnKeyType="next"
                                onSubmitEditing={() => this.password.focus()}
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={username =>
                                    this.setState({ username })
                                }
                                ref={input => (this.username = input)}
                                blurOnSubmit={false}
                            />
                        </View>
                        {(this.state.error === 'username is required.' ||
                            this.state.error === 'username already taken.') && (
                            <Text style={styles.error}>{this.state.error}</Text>
                        )}
                        <View style={styles.field}>
                            <Text style={styles.text}>email</Text>
                            <TextInput
                                type="email"
                                returnKeyType="next"
                                onSubmitEditing={() => this.username.focus()}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={email => this.setState({ email })}
                                ref={input => (this.email = input)}
                                keyboardType="email-address"
                                blurOnSubmit={false}
                            />
                        </View>
                        {(this.state.error ===
                            'The email address is badly formatted.' ||
                            this.state.error ===
                                'The email address is already in use by another account.') && (
                            <Text style={styles.error}>{this.state.error}</Text>
                        )}
                        <View style={styles.field}>
                            <Text style={styles.text}>password</Text>
                            <TextInput
                                returnKeyType="next"
                                secureTextEntry
                                onSubmitEditing={() => this.birthday.focus()}
                                style={styles.input}
                                onChangeText={password =>
                                    this.setState({ password })
                                }
                                ref={input => (this.password = input)}
                                blurOnSubmit={false}
                            />
                        </View>
                        {(this.state.error ===
                            'The password must be 6 characters long or more.' ||
                            this.state.error ===
                                'Password should be at least 6 characters') && (
                            <Text style={styles.error}>{this.state.error}</Text>
                        )}
                        <View style={styles.field}>
                            <Text style={styles.text}>birthday (ddmmyyyy)</Text>
                            <TextInput
                                type="birthday"
                                returnKeyType="next"
                                onSubmitEditing={() => this.city.focus()}
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={birthday =>
                                    this.setState({ birthday })
                                }
                                ref={input => (this.birthday = input)}
                                keyboardType="number-pad"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.text}>city</Text>
                            <TextInput
                                type="city"
                                returnKeyType="next"
                                // onSubmitEditing={() => this.children.focus()}
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={city => this.setState({ city })}
                                ref={input => (this.city = input)}
                                blurOnSubmit={false}
                            />
                        </View>
                        {/* <View style={styles.field}>
              <Text style={styles.text}>children (number)</Text>
              <TextInput
                type="children"
                returnKeyType="next"
                onSubmitEditing={() => this.monthsPostPartum.focus()}
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={children => this.setState({ children })}
                ref={input => (this.children = input)}
                keyboardType="number-pad"
                blurOnSubmit={false}
              />
            </View> */}
                        {/* <View style={styles.field}>
              <Text style={styles.text}>months post partum</Text>
              <TextInput
                type="monthsPostPartum"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={monthsPostPartum => this.setState({ monthsPostPartum })}
                keyboardType="number-pad"
                ref={input => (this.monthsPostPartum = input)}
              />
            </View> */}
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={async () => {
                                // ensure a username is chosen
                                if (!this.state.username.length) {
                                    this.setState({
                                        error: 'username is required.',
                                    })
                                    return
                                }
                                // sign up a user
                                const status = await Fire.shared.signup(
                                    this.state.email,
                                    this.state.password,
                                    this.state.username,
                                    this.state.birthday,
                                    this.state.city,
                                    this.state.children,
                                    this.state.monthsPostPartum
                                )
                                // if error occured, put it on state
                                if (status) {
                                    console.log('error message: ', status)
                                    this.setState({ error: status.message })
                                }
                                // if everything is good
                                else {
                                    console.log(
                                        'else block in sign me up button'
                                    )
                                    this.setState({ showCommunityPopup: true })
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>sign me up!</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.eula}>
                        <Text style={styles.eulaText}>By proceeding with signing in and clicking 'Sign me up!', you agree to our terms as listed in our
                             <Text style={styles.link}
                             onPress={() => Linking.openURL('http://gist.githubusercontent.com/lisjak/5196333df14d1f708563804a885a1b66/raw/8ed9e754f8cbddd156472f02487ef8bcf4ef52ff/apres-eula')}>
                            {' '}End-User License Agreement (EULA) of Après.
                            </Text>
                       </Text>
                   </View>

                    {/* View to control signup popup */}
                    <View>
                        <Modal isVisible={this.state.showCommunityPopup}>
                            <View style={styles.modal}>
                                <View>
                                    <Text style={styles.guidelinesTitle}>
                                        Community Guidelines
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.guidelinesText}>
                                        1. Après is intended to be a place of
                                        acceptance, empathy and compassion Above
                                        all else, try to be kind.
                                    </Text>
                                    <Text style={styles.guidelinesText}>
                                        2. Think before you type.{' '}
                                    </Text>
                                    <Text style={styles.guidelinesText}>
                                        3. If you see something unacceptable,
                                        please flag the comment for review.{' '}
                                    </Text>
                                    <Text style={styles.guidelinesText}>
                                        4. If you experience a user who
                                        repeatedly behaves in an unacceptable
                                        manner, please flag the user for review.{' '}
                                    </Text>
                                    <Text style={styles.guidelinesText}>
                                        5. If you are struggling in a way that
                                        feels overwhelming, please see our
                                        resources for access to professional
                                        mental healthcare providers, and get
                                        help.{' '}
                                    </Text>
                                    <Text style={styles.guidelinesText}>
                                        6. We are open and love your feedback.
                                        Please send us your suggestions on how
                                        to improve your experience.
                                    </Text>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        onPress={this.handleSubmit}
                                        style={styles.buttonContainer}
                                    >
                                        <Text style={styles.accept}>
                                            Accept
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
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
        textAlign: 'justify',
        paddingBottom: 10,
        marginTop: 30,
        flexWrap: 'wrap'
    },
    eulaText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 50,
        marginLeft: 50,
        letterSpacing: 1,
        fontFamily: "Futura-Light",
        marginTop: 10,
        textAlign: 'center'
    },
    link: {
        color: 'blue',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 50,
        marginLeft: 50,
        letterSpacing: 1,
        fontFamily: "Futura-Light",
        textAlign: 'center'
    },
    title: {
        top: 0,
        fontSize: 60,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
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
        marginBottom: 30,
        marginTop: 30,
        marginRight: 50,
        marginLeft: 50,
        paddingBottom: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '600',
        fontSize: 30,
        fontFamily: 'CormorantGaramond-Light',
    },
    error: {
        color: 'red',
        fontSize: 10,
        marginBottom: 0,
        fontFamily: 'Futura-Light',
        marginRight: 50,
        marginLeft: 50,
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
    guidelinesText: {
        fontFamily: 'Futura-Light',
        marginBottom: 10,
    },
    guidelinesTitle: {
        fontFamily: 'Futura-Light',
        marginBottom: 10,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    accept: {
        fontFamily: 'CormorantGaramond-Light',
        textAlign: 'center',
        fontSize: 25,
    },
})
