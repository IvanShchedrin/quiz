import './styles.styl'

import React from 'react'

export default class Gratters extends React.Component {

    constructor(props) {
        super(props);
        this.getGrattersStrings = this.getGrattersStrings.bind(this);
    }

    getGrattersStrings() {
        var gratters = this.props.gratters;

        switch (gratters.reason) {
            case 'getReady' :
                return {
                    reason: '',
                    scoreGained: 'Приготовься к следующему вопросу!',
                    scoreTotal: '',
                    className: 'get-ready'
                };
            case 'you' :
                return {
                    reason: 'Правильный ответ!',
                    scoreGained: 'Количество заработанных очков: ' + gratters.scoreGained,
                    scoreTotal: 'Общий счет: ' + gratters.scoreTotal,
                    className: 'you-right'
                };
            case 'other' :
                return {
                    reason: 'Правильно ответил: ' + gratters.name,
                    scoreGained: 'Количество заработанных очков: ' + gratters.scoreGained,
                    scoreTotal: 'Общий счет: ' + gratters.scoreTotal,
                    className: 'someone-right'
                };
            case 'none' :
                return {
                    reason: '',
                    scoreGained: 'К сожалению, правильно никто так и не ответил.',
                    scoreTotal: '',
                    className: 'none-right'
                };
            case 'waitTheme' :
                return {
                    reason: '',
                    scoreGained: `Подожди, пока ${gratters.name} выберет тему следующего вопроса`,
                    scoreTotal: '',
                    className: 'wait-theme'
                };
            default :
                return null;
        }
    }

    render() {
        if (!this.props.gratters.reason) return null;

        var gratters = this.getGrattersStrings();


        return (
            <div className={`gratters ${gratters.className}`}>
                <span className="reason">{gratters.reason}</span>
                <span className="score-gained">{gratters.scoreGained}</span>
                <span className="score-total">{gratters.scoreTotal}</span>
            </div>
        )
    }

}