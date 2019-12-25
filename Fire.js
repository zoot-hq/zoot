import firebase from 'firebase'; // 4.8.1

class Fire {
    constructor() {
        this.init();
        this.observeAuth();
    }

    init = () =>
        firebase.initializeApp({
            apiKey: "AIzaSyAV5RytixuwijrPzNRMSPV3wGtBy4WVcUs",
            authDomain: "zoot-a3d90.firebaseapp.com",
            databaseURL: "https://zoot-a3d90.firebaseio.com",
            projectId: "zoot-27dbb",
            storageBucket: "zoot-a3d90.appspot.com",
            messagingSenderId: "78123858213",
            appId: "1:78123858213:web:f0a9f8ffd39f1c6b2c42cc",
            measurementId: "G-SCL79MWGSJ"
        });

    observeAuth = () =>
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
            try {
                firebase.auth().signInAnonymously();
            } catch ({ message }) {
                alert(message);
            }
        }
    };

    uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    username() {
        return (firebase.auth().currentUser || {}).username;
    }

    ref() {
        return firebase.database().ref('messages');
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    on = callback =>
        this.ref()
        .limitToLast(20)
        .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {
            return firebase.database.ServerValue.TIMESTAMP;
        }
        // send the message to the Backend
    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                timestamp: this.timestamp,
            };
            this.append(message);
        }
    };

    append = message => this.ref().push(message);

    // close the connection to the Backend
    off() {
        this.ref().off();
    }

    signup = async (email, password, username, birthday, city, children, monthsPostPartum) => {
        try {
            const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
            await user.updateProfile({ username, birthday, city, children, monthsPostPartum })
            await firebase.auth().signInWithEmailAndPassword(email, password)
        } catch (error) {
            return error
        }
    }

    login = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
        } catch (error) {
            return error
        }
    }
}

Fire.shared = new Fire();
export default Fire;