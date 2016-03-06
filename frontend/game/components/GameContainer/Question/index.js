import React from 'react';

var Question = React.createClass({
    render() {
        return(
            <div className="question">{this.props.questionText}</div>
        )
    }
});

export default Question;