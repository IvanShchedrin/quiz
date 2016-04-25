import './styles.styl'

import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Question     from './Question'
import TopMenu      from './TopMenu'
import Hint         from './Hint'
import ActionArea   from './ActionArea'
import InputArea    from './InputArea'

export default class GameContainer extends React.Component{

    hideMenu(e) {
        document.querySelector('.menu-container').classList.remove('menu-show');
        e.target.classList.remove('active');
    }

    render() {

        return(
            <div className="game-wrap">
                <TopMenu theme={this.props.theme} />
                <Question questionText={this.props.question} />
                <Hint hint={this.props.hint} />
                <ActionArea {...this.props} />
                <InputArea isActive={this.props.inputArea} emit={this.props.emit}/>
                <div className="background-shadow" onClick={this.hideMenu}></div>
            </div>
        )
    }
}