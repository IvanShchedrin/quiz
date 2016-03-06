import React from 'react';

import Question from './Question';

var GameContainer = React.createClass({
    render() {
        return(
            <div className="game-wrap">
                <Question questionText="Фотографический снимок; фотография. " />
            </div>
        )
    }
});

export default GameContainer;