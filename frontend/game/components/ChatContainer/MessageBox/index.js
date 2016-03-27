import React from 'react'

import Message from './../Message'

export default class MessageBox extends React.Component{

    render() {
        var messages = this.props.messages.map((message, i) => {
            return(
                <Message name={message.name} text={message.text} key={i} />
            )
        });

        return(
            <div className="message_box">
                {messages}
            </div>
        )
    }

}