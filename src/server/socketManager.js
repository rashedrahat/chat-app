const events = require('../events')
const factories = require('../factories')
const io = require('./index').io

let connectedUsers = {}
let communityChat = factories.createChat()

function isUser(userList, username) {
    return username in userList
}

function addUser(userList, user) {
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}

function removeUser(userList, username) {
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}

/*
* Returns a function that will take a chat id and a boolean isTyping
* and then emit a broadcast to the chat id that the sender is typing
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendTypingToChat(user){
    return (chatId, isTyping)=>{
        io.emit(`${events.TYPING}-${chatId}`, {user, isTyping})
    }
}

/*
* Returns a function that will take a chat id and message
* and then emit a broadcast to the chat id.
* @param sender {string} username of sender
* @return function(chatId, message)
*/
function sendMessageToChat(sender){
    return (chatId, message)=>{
        io.emit(`${events.MESSAGE_RECEIVED}-${chatId}`, factories.createMessage({message, sender}))
    }
}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/

module.exports = function (socket) {
    console.log(`A user connected with socket id: ${socket.id}`);
    console.log('Connected users:', connectedUsers)

    let sendMessageToChatFromUser;

    let sendTypingFromUser;

    // Verify username
    socket.on(events.VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({isUser: true, user: null})
        } else {
            callback({isUser: false, user: factories.createUser({name: nickname})})
        }
    })

    // User connects with username
    socket.on(events.USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user)
        socket.user = user

        sendMessageToChatFromUser = sendMessageToChat(user.name)
        sendTypingFromUser = sendTypingToChat(user.name)

        io.emit(events.USER_CONNECTED, connectedUsers)
        console.log('Connected users:', connectedUsers)
        // console.log(socket)
    })

    // User disconnects
    socket.on('disconnect', ()=>{
        if("user" in socket){
            connectedUsers = removeUser(connectedUsers, socket.user.name)

            io.emit(events.USER_DISCONNECTED, connectedUsers)
            console.log("Disconnect", connectedUsers);
        }
    })


    // User logout
    socket.on(events.LOGOUT, ()=>{
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(events.USER_DISCONNECTED, connectedUsers)
        console.log("Disconnect", connectedUsers);

    })

    //Get Community Chat
    socket.on(events.COMMUNITY_CHAT, (callback)=>{
        callback(communityChat)
    })

    socket.on(events.MESSAGE_SENT, ({chatId, message})=>{
        sendMessageToChatFromUser(chatId, message)
    })

    socket.on(events.TYPING, ({chatId, isTyping})=>{
        sendTypingFromUser(chatId, isTyping)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}