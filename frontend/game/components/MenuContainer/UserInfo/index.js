import './styles.styl'

import React from 'react'

export default class UserInfo extends React.Component{

    hideMainMenu() {
        document.querySelector('.menu-container').classList.remove('menu-show');
        document.querySelector('.background-shadow').classList.remove('active');
    }

    render() {
        return(
            <div className="user-info">
                <i className="fa fa-angle-left" aria-hidden="true" onClick={this.hideMainMenu}></i>
                <span className="info-nickname">{this.props.name}</span>
                <span className="info-score">Общий счет: {this.props.score}</span>
            </div>
        )
    }

}