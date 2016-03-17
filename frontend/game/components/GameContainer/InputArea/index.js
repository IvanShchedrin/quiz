import React from 'react';

import Timer from './Timer';
import InputAnswer from './InputAnswer';

export default class InputArea extends React.Component{
    render() {
        return(
            <div className="input-area">
                <Timer timeLeft={this.props.timeLeft}/>
                <InputAnswer emit={this.props.emit} />
            </div>
        )
    }
}