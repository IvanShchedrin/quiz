import React from 'react';

import Question from './Question'
import TopMenu from './TopMenu'
import Splitter from './Splitter'
import Hint from './Hint'
import Variants from './Variants'
import ChooseTheme from './ChooseTheme'
import InputArea from './InputArea'
import Timer from './Timer'
import Warning from './Warning'

export default class GameContainer extends React.Component{
    render() {
        var variants;

        if (this.props.themesToChoose.length > 0) {
            variants = <ChooseTheme themes={this.props.themesToChoose} emit={this.props.emit} />
        } else {
            variants = <Variants userVariants={this.props.userVariants} />
        }

        return(
            <div className="game-wrap">
                <TopMenu theme={this.props.theme} />
                <Question questionText={this.props.question} />
                <Splitter />
                <Hint hint={this.props.hint} />
                <Splitter />
                <Timer timeLeftStart={this.props.timeLeft} />
                {variants}
                <Splitter />
                <InputArea emit={this.props.emit}/>
                {this.props.warning.text == '' ? null : <Warning warning={this.props.warning} />}
            </div>
        )
    }
}