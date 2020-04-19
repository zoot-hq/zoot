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

    parse = snapshot => {
        const { timestamp, text, user, likes, loves, lightbulbs, flags, room, base64, react, hidden } = snapshot.val();
        const { key: _id } = snapshot;
        const message = {
            _id,
            createdAt: new Date(timestamp),
            text,
            user,
            likes,
            loves,
            lightbulbs,
            flags,
            room,
            timestamp,
            base64,
            react,
            hidden
        };
        return message;
    };

    on = (room, pm, live, callback) =>
        pm ? firebase.database().ref('PMrooms').child(room).limitToLast(10)
            .on('child_added', snapshot => callback(this.parse(snapshot)))
            : 
        live ? firebase.database().ref('livechatrooms').child(room).limitToLast(10)
            .on('child_added', snapshot => callback(this.parse(snapshot)))
            : 
            firebase.database().ref('chatrooms').child(room).limitToLast(10)
            .on('child_added', snapshot => callback(this.parse(snapshot)))

    loadEarlier = (room, lastMessage, pm, callback) => 
        pm? firebase.database().ref('PMrooms').child(room)
            .orderByChild('timestamp').endAt(lastMessage.timestamp - 1).limitToLast(1)
            .once('child_added', snapshot => callback(this.parse(snapshot)))
            : firebase.database().ref('chatrooms').child(room)
            .orderByChild('timestamp').endAt(lastMessage.timestamp - 1).limitToLast(1)
            .once('child_added', snapshot => callback(this.parse(snapshot)))

    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }

    sendImage = (image, room) => {
        const message = {
            text: null,
            user: {
                _id: this.uid(),
                name: this.username()
            },
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
            },
            flags: {
                count: 0
            },
            base64: image.base64,
            react: true
        }

        // push image to database
        const refToMessage = firebase.database().ref('chatrooms').child(room).push(message)

        // push users object to database
        refToMessage.child('likes').child('users').set({X: true})
        refToMessage.child('loves').child('users').set({X: true})
        refToMessage.child('lightbulbs').child('users').set({X: true})
        refToMessage.child('flags').child('users').set({X: true})
    }

    // send the message to the Backend
    send = (messages, room, pm, live) => {
        for (let i = 0; i < messages.length; i++) {

            const { text, user } = messages[i];
            const message = {
                text,
                user,
                room,
                timestamp: this.timestamp,
                likes: {
                    count: 0,
                    users: {X : true}
                },
                loves: {
                    count: 0,
                    users: {X : true}
                },
                lightbulbs: {
                    count: 0,
                    users: {X : true}
                },
                flags: {
                    count: 0,
                    users: {X : true}
                },
                hidden: false,
                react: true
            };

            // push message to database
            const refToMessage = pm ? firebase.database().ref('PMrooms').child(room).push(message)
                                     : 
                                live ? firebase.database().ref('livechatrooms').child(room).push(message)
                                     : firebase.database().ref('chatrooms').child(room).push(message)

            // push users object to database
            refToMessage.child('likes').child('users').set({X: true})
            refToMessage.child('loves').child('users').set({X: true})
            refToMessage.child('lightbulbs').child('users').set({X: true})
            refToMessage.child('flags').child('users').set({X: true})
            
            // if PM, send push notification
            if (pm) {
                // get other users name
                const names = room.split('-')
                const otherUsername = names[0] === this.username() ? names[1] : names[0]

                try {
                    // get token for other user
                    firebase.database().ref('users').child(otherUsername).child('notifToken').once('value').then(async snapshot => {
                        const token = snapshot.val()
                        const pushNotification = {
                            to: token,
                            sound: 'default',
                            title: `New private message from ${this.username()}`,
                            body: `${text}`,
                            _displayInForeground: true,
                            data: { from: this.username(),
                                    pm: true,
                                    room
                                },
                        }

                        // send notification
                        const response = await fetch('https://exp.host/--/api/v2/push/send', {
                            method: 'POST',
                            headers: {
                            Accept: 'application/json',
                            'Accept-encoding': 'gzip, deflate',
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(pushNotification),
                        })
                        })
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    enterRoom(room, pm, live) {

        // prepare initial message
        const user = this.username()
        const text = `${user} has joined the chat!`
        const message = {
            text,
            user,
            room,
            timestamp: this.timestamp,
            react: false
        };

        // enter message into room only if live
        if (live) pm ? firebase.database().ref('PMrooms').child(room).push(message)
            : firebase.database().ref('livechatrooms').child(room).push(message)   

        // update number of participants if not PM
        const ref = live ? 'livechatnames' : 'chatroomnames'
        if (!pm) firebase.database().ref(ref).child(room).child('numOnline').once('value').then(snapshot => {
            firebase.database().ref(ref).child(room).child('numOnline').set(snapshot.val() + 1)
        })
    }

    leaveRoom(room, pm, live) {

        // prepare initial message
        const user = this.username()
        const text = `${user} has left the chat`
        const message = {
            text,
            user,
            room,
            timestamp: this.timestamp,
            react: false
        };

        // enter message into room only if live
        if (live) pm ? firebase.database().ref('PMrooms').child(room).push(message)
            : firebase.database().ref('livechatrooms').child(room).push(message)   

        // update number of participants if not PM
        const ref = live ? 'livechatnames' : 'chatroomnames'
        if (!pm) firebase.database().ref(ref).child(room).child('numOnline').once('value').then(snapshot => {
            firebase.database().ref(ref).child(room).child('numOnline').set(snapshot.val() - 1)
        })
    }

    // close the connection to the Backend
    off() {
        firebase.database().ref('chatrooms').off();
        firebase.database().ref('PMrooms').off();
        firebase.database().ref('PMnames').off();
    }


    signup = async (email, password, username, birthday, city, children, monthsPostPartum) => {
        try {

            // check to see if username already exists
            const status = await this.userExists(username, {exists: false})
            if (status.val() || username === 'X') {
                throw new Error('username already taken.')
            }

            await firebase.auth().createUserWithEmailAndPassword(email, password)
            await firebase.auth().signInWithEmailAndPassword(email, password)

            // add in custom fields
            const refToUser = firebase.database().ref('users').child(username)
            refToUser.set({ birthday, city, children, monthsPostPartum, email })

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

    removeChatRooms = (callback) =>
        firebase.database().ref('chatroomnames')
        .on('child_removed', snapshot => callback(this.parseRooms(snapshot)));
        
    getPMRooms = (callback) => {
        return firebase.database().ref('PMnames')
        .on('child_added', snapshot => callback(this.parsePMs(snapshot)));
    }

    parsePMs = snapshot => {
        const currentUser = this.username()
        const { name } = snapshot.val()
        const names = name.split('-')
        if (names[0] === currentUser|| names[1] === currentUser){
            return name
        }      
    }

    parseRooms = snapshot => {
        const { name, numOnline } = snapshot.val()
        return {name, numOnline}
    };

    createChatRoom = async room => 
        firebase.database().ref('chatrooms').child(room).once('value', snapshot => {
            const exists = (snapshot.val() !== null)

            if (!exists) {
                // add room to chatroom list
                firebase.database().ref('chatroomnames').child(room).set({ name : room })

                // add number of participants
                firebase.database().ref('chatroomnames').child(room).child('numOnline').set(0)

                const initMessage = {
                    room,
                    text: `Welcome to # ${room} - send a message to get the conversation started`,
                    timestamp: Date.now(),
                    user: {
                        name: `#${room}`
                    },
                    react: false
                }

                // add room to chatrooms, with initial message
                firebase.database().ref('chatrooms').child(room).push(initMessage)
            }
        })

    createPMRoom = async (room, callback) => 
        firebase.database().ref('PMrooms').child(room).once('value', snapshot => {
            const exists = (snapshot.val() !== null)

            if (!exists) {

                // check if user is blocked
                return firebase.database().ref('blockedUserRelationships').child(room).once('value', snapshot => {
                    const exists = (snapshot.val() !== null)

                    // if user is blocked, return so
                    if (exists) {
                        callback('user blocked') 
                    }

                    // else continue to create the chatroom
                    else {

                        // add room to chatroomPM lists
                        firebase.database().ref('PMnames').child(room).set({ name : room })

                        const initMessage = {
                            room,
                            text: `Welcome to # ${room} - this is the beginning of your private message chat`,
                            timestamp: Date.now(),
                            user: {
                                name: `#${room}`
                            },
                            react: false
                        }

                        // add room to chatrooms
                        firebase.database().ref('PMrooms').child(room).push(initMessage);

                        callback('user not blocked')
                    }
                })
            }
            else callback('all good')
        })
    
    
    createLiveRoomIfDoesNotExist = async (room, callback) => 
        firebase.database().ref('livechatnames').child(room).once('value', snapshot => {
            const exists = (snapshot.val() !== null)

            if (!exists) {

                // add room to chatroomPM lists
                firebase.database().ref('livechatnames').child(room).set({ name : room })

                // add number of participants
                firebase.database().ref('livechatnames').child(room).child('numOnline').set(0)

                const initMessage = {
                    room,
                    text: `Welcome to # ${room} - this is the beginning of your private message chat`,
                    timestamp: Date.now(),
                    user: {
                        name: `#${room}`
                    },
                    react: false
                }

                // add room to chatrooms
                firebase.database().ref('livechatrooms').child(room).push(initMessage)

                callback()
            }
            else callback()
        })

    // this function updates the database in increasing the reaction type of
    // a message by 1
    react(message, reactionType, updatedCount) {
        const { room, _id } = message
        const ref = firebase.database().ref('chatrooms').child(room).child(_id)

        // set number of likes/loves
        ref.child(reactionType).set({count : updatedCount})

        //set users object
        ref.child(reactionType).child('users').set(message[reactionType].users)

        if (reactionType === 'flags' && updatedCount) {
            ref.child('hidden').set(true)
            ref.child('react').set(false)
        }
    }

    // takes in the user to be blocked by current user
    blockUser = (userToBlock) => {
        const currentUser = this.username()

        const comboname = userToBlock < currentUser ? userToBlock + '-' + currentUser : currentUser + '-' + userToBlock

        firebase.database().ref('blockedUserRelationships').child(comboname).set(true)
        firebase.database().ref('PMnames').child(comboname).set({})
        firebase.database().ref('PMrooms').child(comboname).set({})
    }

    // this function sets up a connection with the database to send back updates on changes in online partcipants 
    getUpdatedNumOnline = (callback) => {
        firebase.database().ref('chatroomnames').on('child_changed', snapshot => callback(snapshot.val()))
    }

    sendPasswordResetEmail = (email) => {
        return firebase.auth().sendPasswordResetEmail(email)
    }

    sendNotificationToken = (token) => {
        firebase.database().ref('users').child(this.username()).child('notifToken').set(token)
    }
}

Fire.shared = new Fire();
export default Fire;
