import React from 'react';

export default class Hint extends React.Component{
    render() {
        return(
            <div className="hint">
                <span className="hint-letters">{this.props.hint}</span>
            </div>
        )
    }
}