import React from 'react';
import io from 'socket.io-client'

import GameContainer from './GameContainer';

export default class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            hint: '',
            theme: 'Quiz',
            question: '',
            gameState: -1,
            name: ''
        };
        this.hint = this.hint.bind(this);
        this.emit = this.emit.bind(this);
        this.connected = this.connected.bind(this);
    }

    componentWillMount() {
        this.socket = io.connect('', {
            'reconnectionDelay': 125,
            'reconnectionDelayMax': 500
        });
        this.socket.on('connected', this.connected);
        this.socket.on('hint', this.hint);
    }

    hint(msg) {
        this.setState({ hint: msg.letters });
    }

    connected(data) {
        this.setState({
            theme: data.theme,
            question: data.question,
            gameState: data.gameState,
            name: data.name
        })
    }

    emit(event, data) {
        this.socket.emit(event, data);
    }

    render() {
        return(
            <GameContainer emit={this.emit} {...this.state}/>
        )
    }
}