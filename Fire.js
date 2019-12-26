import firebase from 'firebase'; 
import firebaseInfo from './secrets'

class Fire {
    constructor() {
        this.init();
        this.observeAuth();
    }

    init = () =>
        firebase.initializeApp(firebaseInfo);

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
        return (firebase.auth().currentUser || {}).displayName;
    }

    ref() {
        return firebase.database().ref('chatrooms');
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
            _id,
            createdAt: timestamp,
            text,
            user,
        };
        return message;
    };

    on = (room, callback) =>
        this.ref().child(room)
        .limitToLast(20)
        .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
    // send the message to the Backend
    send = (messages, room) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                room,
                timestamp: this.timestamp,
            };
            this.append(room, message);
        }
    };

    append = (room, message) => this.ref().child(room).push(message)

    // close the connection to the Backend
    off() {
        this.ref().off();
    }

    signup = async (email, password, username, birthday, city, children, monthsPostPartum) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password)
            await firebase.auth().signInWithEmailAndPassword(email, password)
            const user = firebase.auth().currentUser;
            await user.updateProfile({
                displayName: username || 'anonymous'
              })             
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