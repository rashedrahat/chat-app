const uuid = require('uuid-random')
const moment = require('moment')

const createUser = ({name = ""} = {}) => {
    return {
        id: uuid(),
        name
    }
}

const createMessage = ({message = "", sender = ""} = {}) => {
    return {
        id: uuid(),
        time: moment().format('h:mm a'),
        message,
        sender
    }
}

const createChat = ({messages = [], name = "Community", users = []} = {}) => {
    return {
        id: uuid(),
        name,
        messages,
        users,
        typingUsers: []
    }
}

module.exports = {
    createMessage,
    createChat,
    createUser
}