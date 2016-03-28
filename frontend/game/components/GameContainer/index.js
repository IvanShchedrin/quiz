import React from 'react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Question     from './Question'
import TopMenu      from './TopMenu'
import Splitter     from './Splitter'
import Hint         from './Hint'
import Variants     from './Variants'
import ChooseTheme  from './ChooseTheme'
import InputArea    from './InputArea'
import Timer        from './Timer'
import Warning      from './Warning'

export default class GameContainer extends React.Component{

    render() {
        var warning = null;

        if (this.props.warning !== '') {
            warning = <Warning warning={this.props.warning} />
        }

        return(
            <div className="game-wrap">
                <TopMenu theme={this.props.theme} />
                <Question questionText={this.props.question} />
                <Splitter />
                <Hint hint={this.props.hint} />
                <Splitter />
                <Timer timeLeftStart={this.props.timeLeft} />

                {
                    this.props.themesToChoose.length > 0 ?
                    <ChooseTheme themes={this.props.themesToChoose} emit={this.props.emit} /> :
                    <Variants userVariants={this.props.userVariants} />
                }

                <Splitter />
                <InputArea emit={this.props.emit}/>

                <ReactCSSTransitionGroup
                    transitionName = "fadeout"
                    transitionEnterTimeout = {500}
                    transitionLeaveTimeout = {500}>
                    {warning}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}