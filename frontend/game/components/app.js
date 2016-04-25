import React from 'react'
import io from 'socket.io-client'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import GameContainer from './GameContainer'
import ChatContainer from './ChatContainer'
import MenuContainer from './MenuContainer'

import './styles.styl';

export default class App extends React.Component {

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
            warning: '',
            inputArea: 0,
            gratters: {
                reason: '',
                name: '',
                scoreGained: 0,
                scoreTotal: 0
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
                usersOnline: data.usersOnline,
                inputArea: data.gameState === 2 ? 1 : 0
            })
        });

        this.socket.on('new question', data => {
            this.setState({
                hint: data.letters,
                question: data.question,
                inputArea: 1,
                userVariants: [],
                timeLeft: data.timer,
                gratters: {}
            })
        });

        this.socket.on('right answer', data => {
            var gratter = data.name ? {
                reason: 'other',
                name: data.name,
                scoreGained: data.score,
                scoreTotal: data.totalScore
            } : {
                reason: 'none'
            };

            this.setState({
                hint: data.answer,
                inputArea: 0,
                timeLeft: -1,
                gratters: gratter
            })
        });

        this.socket.on('you right', data => {
            this.setState({
                hint: data.answer,
                inputArea: 0,
                timeLeft: -1,
                score: data.totalScore,
                gratters: {
                    reason: 'you',
                    name: '',
                    scoreGained: data.score,
                    scoreTotal: data.totalScore
                }
            })
        });

        this.socket.on('wrong answer', answer => {
            this.setState({
                userVariants: this.state.userVariants.concat([{
                    answer: answer.answer,
                    name: answer.name,
                    style: this.getVariantPosition()
                }])
            })
        });

        this.socket.on('get ready', data => {
            this.setState({
                theme: data.theme,
                question: '',
                hint: '',
                themesToChoose: [],
                userVariants: [],
                timeLeft: data.timer,
                gratters: {
                    reason: 'getReady'
                }
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
                timeLeft: data.timer,
                question: 'Выбери тему следующего вопроса',
                hint: '',
                userVariants: [],
                gratters: {}
            })
        });

        this.socket.on('wait theme', data => {
            this.setState({
                hint: '',
                userVariants: [],
                timeLeft: data.timer,
                gratters: {
                    reason: 'waitTheme',
                    name: data.name
                }
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
                    break;
                default:
                    reason = 'Ошибка';
            }

            clearTimeout(this.warningTimeout);

            this.warningTimeout = setTimeout(() => {
                this.setState({
                    warning: ''
                })
            }, 2500);

            this.setState({
                warning: reason
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

    getVariantPosition() {
        var horizont = Math.floor( Math.random() * 100 );
        var vertical = Math.floor( Math.random() * 100 );
        var position = {};

        if (horizont > 50) {
            position.right = (100 - horizont) + '%';
        } else {
            position.left = (horizont) + '%';
        }

        if (vertical > 50) {
            position.bottom = (100 - vertical) + '%';
        } else {
            position.top = (vertical) + '%';
        }

        position.backgroundColor = `rgba(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},.5)`;

        return position;
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