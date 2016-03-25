import React from 'react';

export default class InputArea extends React.Component{

    constructor(props) {
        super(props);
        this.tryAnswer = this.tryAnswer.bind(this);
    }

    tryAnswer(elem) {
        this.props.emit('answer', elem.target.answer.value);
        elem.target.answer.value = '';
    }

    render() {
        return(
            <div className="input-area">
                <form action="javascript:void(0)" onSubmit={this.tryAnswer}>
                    <input
                        type="text"
                        name="answer"
                        autoComplete="off"
                        placeholder="Я знаю ответ!"/>

                    <button>Ответ</button>
                </form>
            </div>
        )
    }
}