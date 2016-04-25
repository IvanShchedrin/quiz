import './style.styl'

import React from 'react'

export default class TopMenu extends React.Component{

    showMainMenu() {
        document.querySelector('.menu-container').classList.add('menu-show');
        document.querySelector('.background-shadow').classList.add('active');
    }

    toggleChat(e) {
        let btnClasslist = e.target.classList;
        let chatClasslist = document.querySelector('.chat-container').classList;
        let gameClasslist = document.querySelector('.game-wrap').classList;

        if (btnClasslist.contains('fa-commenting-o')) {
            gameClasslist.add('chat-opened');
            chatClasslist.add('chat-show');
            btnClasslist.remove('fa-commenting-o');
            btnClasslist.add('fa-angle-right');
        } else {
            gameClasslist.remove('chat-opened');
            chatClasslist.remove('chat-show');
            btnClasslist.remove('fa-angle-right');
            btnClasslist.add('fa-commenting-o');
        }
    }

    render() {
        return(
            <div className="top-menu">
                <i className="fa fa-bars" onClick={this.showMainMenu}></i>
                <span className="menu-middle">{'Викторина' + (this.props.theme == '' ? '' : ' | ' + this.props.theme.toUpperCase())}</span>
                <i className="fa fa-commenting-o"  onClick={this.toggleChat}></i>
            </div>
        )
    }
};