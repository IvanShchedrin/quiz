import React from 'react';
import io from 'socket.io-client'

import GameContainer from './GameContainer';

export default class App extends React.Component{

    constructor() {
        super();
        this.state = {
            hint: '',
            theme: 'Quiz',
            question: '',
            gameState: -1,
            name: '',
            userVariants: []
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
                question: data.question,
                gameState: data.gameState,
                name: data.name
            })
        });

        this.socket.on('new question', data => {
            this.setState({
                question: data.question,
                hint: data.letters,
                userVariants: []
            })
        });

        this.socket.on('right answer', data => {
            this.setState({
                hint: data.answer
            })
        });

        this.socket.on('you right', data => {
            this.setState({
                hint: data.answer
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
                hint: ''
            })
        });

        this.socket.on('hint', word => {
            this.setState({
                hint: word.letters
            })
        });

        this.socket.on('logout', () => {
            location.href = '/'
        });

    }

    emit(event, payload) {
        this.socket.emit(event, payload);
    }

    render() {
        return(
            <GameContainer emit={this.emit} {...this.state}/>
        )
    }
}