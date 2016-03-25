import React from 'react'
import io from 'socket.io-client'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import GameContainer from './GameContainer';
//import './styles.styl';

export default class App extends React.Component{

    constructor() {
        super();
        this.state = {
            hint: '',
            theme: 'Quiz',
            question: '',
            gameState: 0,
            name: '',
            userVariants: [],
            usersOnline: 0,
            timeLeft: -1,
            themesToChoose: [],
            warning: {
                type: '',
                text: ''
            }
        };

        this.emit = this.emit.bind(this);
    }

    componentWillMount() {
        this.socket = io.connect('', {
            'reconnectionDelay': 125,
            'reconnectionDelayMax': 500
        });

        this.socket.on('connected', (data) => {
            this.setState({
                theme: data.theme,
                hint: data.hint,
                question: data.question,
                gameState: data.gameState,
                name: data.name,
                usersOnline: data.usersOnline
            })
        });

        this.socket.on('new question', data => {
            this.setState({
                question: data.question,
                hint: data.letters,
                userVariants: [],
                timeLeft: data.timer
            })
        });

        this.socket.on('right answer', data => {
            this.setState({
                hint: data.answer,
                timeLeft: -1
            })
        });

        this.socket.on('you right', data => {
            this.setState({
                hint: data.answer,
                timeLeft: -1
            })
        });

        this.socket.on('wrong answer', answer => {
            this.setState({
                userVariants: this.state.userVariants.concat([answer])
            })
        });

        this.socket.on('get ready', data => {
            this.setState({
                theme: data.theme,
                question: '',
                hint: '',
                themesToChoose: [],
                userVariants: [],
                timeLeft: data.timer
            })
        });

        this.socket.on('hint', data => {
            this.setState({
                hint: data.letters,
                timeLeft: data.timer
            })
        });

        this.socket.on('choose theme', data => {
            this.setState({
                themesToChoose: data.themes,
                timeLeft: data.timer
            })
        });

        this.socket.on('wait theme', data => {
            this.setState({
                timeLeft: data.timer
            })
        });

        this.socket.on('too late', data => {
            var reason;
            switch (data.gameState) {
                case 1:
                    reason = 'Слишком рано';
                    break;
                case 3:
                    reason = 'Поздно. Ответ уже угадан';
                    break;
                case 4:
                    reason = 'Поздно. Время вышло';
                    break;
                case 5:
                    reason = 'Слишком рано. Идет выбор темы';
                    break;
                case 0:
                    reason = 'Игра выключена';
            }

            clearTimeout(this.warningTimeout);

            this.warningTimeout = setTimeout(() => {
                this.setState({
                    warning: {
                        type: '',
                        text: ''
                    }
                })
            }, 2500);

            this.setState({
                warning: {
                    type: 'notNow',
                    text: reason
                }
            })
        });

        this.socket.on('logout', function() {
            location.href = '/'
        })
    }

    emit(event, payload) {
        this.socket.emit(event, payload);
    }

    render() {
        return(
            <ReactCSSTransitionGroup
                component="div"
                transitionName = "fadeout"
                transitionAppear = {true}
                transitionAppearTimeout = {1000}
                transitionEnter = {false}
                transitionLeave = {false}>

                <GameContainer emit={this.emit} {...this.state}/>
            </ReactCSSTransitionGroup>
        )
    }
}