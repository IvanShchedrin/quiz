import React from 'react';

import Question from './Question';
import TopMenu from './TopMenu';
import Splitter from './Splitter';
import Hint from './Hint';
import Variants from './Variants';
import InputArea from './InputArea';

export default class GameContainer extends React.Component{
    render() {
        return(
            <div className="game-wrap">
                <TopMenu theme={this.props.theme}/>
                <Question questionText={this.props.question}/>
                <Splitter />
                <Hint hint={this.props.hint} />
                <Splitter />
                <Variants userVariants={this.props.userVariants}/>
                <InputArea emit={this.props.emit} timeLeft="3" />
            </div>
        )
    }
}