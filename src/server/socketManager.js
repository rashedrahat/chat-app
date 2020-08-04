const events = require('../events')
const factories = require('../factories')
const io = require('./index').io

let connectedUsers = {}

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

module.exports = function (socket) {
    console.log(`A user connected with socket id: ${socket.id}`);
    console.log('Connected users:', connectedUsers)

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

        io.emit(events.USER_CONNECTED, connectedUsers)
        console.log('Connected users:', connectedUsers)
        // console.log(socket)
    })

    // User disconnects

    // User logout

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}