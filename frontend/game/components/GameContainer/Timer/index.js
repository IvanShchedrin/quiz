import React, {PropTypes} from 'react'

class Timer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            timeLeft: 1,
            timeoutID: 0
        };

        this.tickTimer = this.tickTimer.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.timeLeftStart > 0 && this.state.timeLeft > 0) return;

        clearInterval(this.intervalID);

        if (nextProps.timeLeftStart > 0) {
            this.intervalID = setInterval(this.tickTimer, 1000);
            this.setState({timeLeft: nextProps.timeLeftStart / 1000});

            setTimeout(() => {
                clearInterval(this.intervalID);
                this.setState({
                    timeLeft: 0
                })
            }, nextProps.timeLeftStart - 20);
        } else {
            this.setState({
                timeLeft: -1
            })
        }
    }

    tickTimer() {
        this.setState({timeLeft: this.state.timeLeft - 1});
    }

    render() {
        return(
            <div className="timer">{this.state.timeLeft < 1 ? '' : this.state.timeLeft}</div>
        )
    }

}

Timer.propTypes = { timeLeftStart: PropTypes.number };

export default Timer;