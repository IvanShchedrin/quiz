import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Question     from './Question'
import TopMenu      from './TopMenu'
import Hint         from './Hint'
import Variants     from './Variants'
import ChooseTheme  from './ChooseTheme'
import InputArea    from './InputArea'
import Timer        from './Timer'
import Warning      from './Warning'
import Gratters     from './Gratters'

export default class GameContainer extends React.Component{

    render() {
        var warning = this.props.warning !== '' ? <Warning warning={this.props.warning} /> : null;
        var variantsOrThemes = this.props.themesToChoose.length > 0 ?
            <ChooseTheme themes={this.props.themesToChoose} emit={this.props.emit} /> :
            <Variants userVariants={this.props.userVariants} />;
        var gratters = this.props.gratters.reason !== '' ? <Gratters gratters={this.props.gratters} /> : null;
        var inputArea = this.props.inputArea === 1 ? <InputArea emit={this.props.emit}/> : null;

        return(
            <div className="game-wrap">
                <TopMenu theme={this.props.theme} />
                <Question questionText={this.props.question} />
                <Hint hint={this.props.hint} />
                <Timer timeLeftStart={this.props.timeLeft} />
                {variantsOrThemes}
                {gratters}
                {inputArea}

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