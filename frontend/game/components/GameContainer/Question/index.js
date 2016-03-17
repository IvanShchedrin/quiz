import React from 'react';

export default class Login extends React.Component{
    render() {
        return(
            <div className="question">{this.props.questionText}</div>
        )
    }
}