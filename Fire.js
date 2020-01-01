import firebase from 'firebase'; 
import firebaseInfo from './secrets'

class Fire {
    constructor() {
        this.init();
    }

    init = () =>
        firebase.initializeApp(firebaseInfo);

    uid() {
        return (firebase.auth().currentUser || {}).uid;
    }  

    username() {
        return (firebase.auth().currentUser || {}).displayName;
    }

    parseSnapshots = snapshots => {
        for (snapshot in snapshots){
            return this.parse(snapshot)
        }
    }

    parse = snapshot => {
        const { timestamp, text, user, likes, loves, lightbulbs, room } = snapshot.val();
        const { key: _id } = snapshot;
        const message = {
            _id,
            createdAt: new Date(timestamp),
            text,
            user,
            likes,
            loves,
            lightbulbs,
            room,
            timestamp
        };
        return message;
    };

    on = (room, callback) => 
        firebase.database().ref('chatrooms').child(room).limitToLast(10)
        .on('child_added', snapshot => callback(this.parse(snapshot)))

    loadEarlier = (room, lastMessage, callback) => firebase.database().ref('chatrooms').child(room)
        .orderByChild('timestamp').endAt(lastMessage.timestamp - 1).limitToLast(1)
        .once('child_added', snapshot => callback(this.parse(snapshot)))
    
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
                likes: {
                    count: 0,
                },
                loves: {
                    count: 0,
                },
                lightbulbs: {
                    count: 0
                }
            };

            // push message to database
            const refToMessage = firebase.database().ref('chatrooms').child(room).push(message)

            // push users object to database
            refToMessage.child('likes').child('users').set({X: true})
            refToMessage.child('loves').child('users').set({X: true})
            refToMessage.child('lightbulbs').child('users').set({X: true})
        }
    };


    // close the connection to the Backend
    off() {
        firebase.database().ref('chatrooms').off();
    }

    signup = async (email, password, username, birthday, city, children, monthsPostPartum) => {
        try {

            // check to see if username already exists
            const status = await this.userExists(username, {exists: false})
            if (status.val()) {
                throw new Error('username already taken.')
            }

            await firebase.auth().createUserWithEmailAndPassword(email, password)
            await firebase.auth().signInWithEmailAndPassword(email, password)
            
            
            // add in custom fields
            firebase.database().ref('users').child(username).set({ birthday, city, children, monthsPostPartum, email })
            
            // add displayname
            const user = firebase.auth().currentUser;
            await user.updateProfile({
                displayName: username
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

    // returns true if username exists, false otherwise
    userExists = async (username, status) => 
        await firebase.database().ref('users').child(username).once("value", snapshot => {
            if(snapshot.exists()) {
                status.exists = true
            }
            return status
        })

    getChatRoomNames = (callback) =>
        firebase.database().ref('chatroomnames')
        .on('child_added', snapshot => callback(this.parseRooms(snapshot)));

    parseRooms = snapshot => {
        const { name } = snapshot.val();
        return name;
    };

    createRoom = room => {

        // add room to chatroomnames
        firebase.database().ref('chatroomnames').child(room).set({ name : room })

        const initMessage = {
            room,
            text: `Welcome to # ${room} - send a message to get the conversation started`,
            timestamp: Date.now(),
            user: {
                name: `#${room}`
            }
        }

        // add room to chatrooms
        firebase.database().ref('chatrooms').child(room).push(initMessage);
    }

    // this function updates the database in increasing the reaction type of 
    // a message by 1
    react(message, reactionType, updatedCount) {
        const { room, _id } = message
        const ref = firebase.database().ref('chatrooms').child(room).child(_id).child(reactionType)

        // set number of likes/loves
        ref.set({count : updatedCount})

        //set users object
        ref.child('users').set(message[reactionType].users)
    }
}

Fire.shared = new Fire();
export default Fire;