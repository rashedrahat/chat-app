import React from "react";
import * as events from "../events";

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nickname: "",
            error: "",
            success: ""
        }
    }

    setError = (error) => {
        this.setState({error: error})
    }

    setSuccess = (success) => {
        this.setState({success: success})
    }

    setUser = ({user, isUser}) => {
        console.log(user, isUser)
        if (isUser) {
            this.setError("Username already been taken!")
            this.setSuccess("")
        } else {
            this.props.setUser(user)
            this.setError("")
            this.setSuccess("Great! You are ready to chat..")
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const {socket} = this.props
        const {nickname} = this.state
        socket.emit(events.VERIFY_USER, nickname, this.setUser)
    }

    handleChange = (e) => {
        this.setState({nickname: e.target.value})
    }

    render() {
        const {nickname, error, success} = this.state
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <label>
                        <h2>Got a nickname?</h2>
                    </label>
                    <input type="text" value={nickname} placeholder={'MyCoolUsername'} id="nickname"
                           onChange={this.handleChange}/>
                    <div className="error">{error ? error : null}</div>
                    <div className="active">{success ? success : null}</div>
                </form>
            </div>
        );
    }
}

export default Login;