import React from 'react';

export default class InputArea extends React.Component{

    constructor(props) {
        super(props);
        this.tryAnswer = this.tryAnswer.bind(this);
    }

    tryAnswer(e) {
        this.props.emit('answer', e.target.answer.value.slice(0, 30));
        e.target.answer.value = '';
    }

    render() {
        return(
            <div className="game-input-area">
                <form action="javascript:void(0)" onSubmit={this.tryAnswer}>
                    <input
                        type="text"
                        name="answer"
                        autoComplete="off"
                        maxLength={30}
                        placeholder="Я знаю ответ!"/>

                    <button>Ответ</button>
                </form>
            </div>
        )
    }
}
