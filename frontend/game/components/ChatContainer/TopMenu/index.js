import './styles.styl'

import React from 'react'

export default class TopMenu extends React.Component{

    render() {
        return(
            <div className="chat-top-menu">
                <i className="fa fa-angle-right"></i>
                <span className="users-online">В сети: {this.props.usersOnline}</span>
            </div>
        )
    }

    //<span className="my-nickname">{this.props.name}</span>
}