import React from 'react';
import './styles.styl';

export default class Hint extends React.Component{
    render() {
        return(
            <div className="hint">
                <span className="hint_letters">{this.props.hint}</span>
            </div>
        )
    }
}