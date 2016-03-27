import React from 'react';

import MessageBox   from './MessageBox'
import InputArea    from './InputArea'
import TopMenu      from './TopMenu'

import './styles.styl'

export default class GameContainer extends React.Component{

    render() {
        return(
            <div className="chat-wrap">
                <TopMenu name={this.props.name} usersOnline={this.props.usersOnline} />
                <MessageBox messages={this.props.messages} />
                <InputArea emit={this.props.emit} name={this.props.name} />
            </div>
        )
    }
}