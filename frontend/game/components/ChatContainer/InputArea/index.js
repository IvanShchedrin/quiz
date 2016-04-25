import './styles.styl'

import React from 'react'

export default class InputArea extends React.Component{

    constructor(props) {
        super(props);
        this.textChanged = this.textChanged.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    textChanged(e) {
        if (e.which === 13) {
            e.preventDefault();
            this.sendMessage()
        }
    }

    sendMessage(e) {
        var textarea = document.querySelector('#chat-input');

        this.props.emit('chat message', {
            text: textarea.value.slice(0, 256),
            name: this.props.name
        });

        textarea.value = '';
    }

    render() {
        return(
            <div className="chat-input-area">
                <div className="chat-textarea">
                    <textarea
                        id="chat-input"
                        name="message"
                        cols="30" rows="3"
                        maxLength={256}
                        onKeyPress={this.textChanged}>

                    </textarea>
                </div>
                <div className="chat-btns">
                    <input type="submit" value="Отправить" onClick={this.sendMessage}/>
                </div>
            </div>
        )
    }

}