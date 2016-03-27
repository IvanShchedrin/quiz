import React from 'react'
import io from 'socket.io-client'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import GameContainer from './GameContainer'
import ChatContainer from './ChatContainer'
import MenuContainer from './MenuContainer'

import './styles.styl';

export default class App extends React.Component{

    // TODO: Change 'name' to prop, init on socket's 'connected'
    constructor() {
        super();
        this.state = {
            hint: '',
            theme: 'Quiz',
            question: '',
            gameState: 0,
            name: '',
            score: 0,
            userVariants: [],
            usersOnline: '?',
            timeLeft: -1,
            themesToChoose: [],
            messages: [],
            warning: {
                // pulse - short light, wihout message (wrong answer, etc.)
                // error - medium light, showing message (too late, etc.)
                // info - long light, showing message (you right, etc.)
                type: '',
                text: '',
                time: ''
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
                score: data.score,
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
                timeLeft: -1,
                score: data.totalScore
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

        this.socket.on('new message', (data) => {
            this.setState({
                messages: this.state.messages.concat(data)
            })
        });

        this.socket.on('somebody disc', (data) => {
            this.setState({
                usersOnline: data.usersOnline
            })
        });

        this.socket.on('somebody conn', (data) => {
            this.setState({
                usersOnline: data.usersOnline
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

                <MenuContainer name={this.state.name} score={this.state.score} />
                <GameContainer emit={this.emit} {...this.state} />
                <ChatContainer emit={this.emit} {...this.state} />

            </ReactCSSTransitionGroup>
        )
    }
}