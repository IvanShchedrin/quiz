import React from 'react'

export default class Message extends React.Component{

    render() {
        return(
            <div className="message">
                <div className="nickname">{this.props.name}</div>
                <div className="message_text">{this.props.text}</div>
            </div>
        )
    }

}