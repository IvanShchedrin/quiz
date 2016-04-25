import './styles.styl'

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

    //inputTouch(e) {
    //    document.querySelector('body').setAttribute('style', 'background-color: yellow')
    //}
    //
    //inputBlurTouchscreen(e) {
    //    document.querySelector('body').setAttribute('style', 'background-color: red')
    //}

    render() {
        var inputs = this.props.isActive === 0 ? null :
            <form action="javascript:void(0)" onSubmit={this.tryAnswer}>
                <input
                    type="text"
                    name="answer"
                    autoComplete="off"
                    maxLength={30}
                    placeholder="Я знаю ответ!"/>

                <button>Ответ</button>
            </form>;

        return(
            <div className="game-input-area">
                {inputs}
            </div>
        )
    }
}
