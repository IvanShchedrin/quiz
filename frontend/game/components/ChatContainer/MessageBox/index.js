import './styles.styl'

import React from 'react'

export default class MessageBox extends React.Component{

    render() {
        var messages = this.props.messages.map((message, i) => {
            return(
                <Message name={message.name} text={message.text} key={i} />
            )
        });

        return(
            <div className="message-box">
                {messages}
            </div>
        )
    }

}

class Message extends React.Component{

    render() {
        return(
            <div className="message">
                <span className="nickname">{this.props.name}</span>
                {this.props.text}
            </div>
        )
    }

}