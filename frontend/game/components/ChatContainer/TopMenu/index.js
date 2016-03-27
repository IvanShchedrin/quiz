import React from 'react'

export default class TopMenu extends React.Component{

    render() {
        return(
            <div className="chat-top-menu">
                <span className="my-nickname">{this.props.name}</span>
                <span className="users-online">В сети: {this.props.usersOnline}</span>
            </div>
        )
    }

}