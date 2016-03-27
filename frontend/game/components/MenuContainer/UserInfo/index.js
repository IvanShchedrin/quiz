import React from 'react'

export default class UserInfo extends React.Component{

    render() {
        return(
            <div className="user-info">
                <span className="info-nickname">{this.props.name}</span>
                <span className="info-score">Общий счет: {this.props.score}</span>
            </div>
        )
    }

}