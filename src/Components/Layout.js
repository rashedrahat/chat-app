import React from "react";
import io from 'socket.io-client'
import * as events from '../events'
import Login from "./Login";

const socketUrl = "http://192.168.0.107:3231"

class Layout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            user: null
        }
    }

    componentWillMount() {
        this.initSocket()
    }

    initSocket = () => {
        const socket = io(socketUrl)
        socket.on('connect', () => {
            console.log("Connected", socket)
        })
        this.setState({socket: socket})
    }

    setUser = (user) => {
        const {socket} = this.state
        socket.emit(events.USER_CONNECTED, user)
        this.setState({user: user})
    }

    logout = () => {
        const {socket} = this.state
        socket.emit(events.LOGOUT)
        this.setState({user: null})
    }

    render() {
        return (
            <div className="container">
            <Login socket={this.state.socket} setUser={this.setUser}/>
            </div>
        );
    }
}

export default Layout;