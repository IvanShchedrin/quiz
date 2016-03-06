
import React from 'react';

import Question from './Question';
import TopMenu from './TopMenu';
import Splitter from './Splitter';
import Hint from './Hint';
import Variants from './Variants';

var wrongAnswers = [
    {name: 'Admin', answer: 'чупакабра'},
    {name: 'User1', answer: 'билл гейтс'},
    {name: 'Banana', answer: 'колбаса'},
    {name: 'Phil', answer: 'пончик'}
];

var GameContainer = React.createClass({
    render() {
        return(
            <div className="game-wrap">
                <TopMenu theme="Тема вопроса"/>
                <Question questionText="Фотографический снимок; фотография. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. A assumenda autem consectetur, exercitationem facere harum inventore minus officia
                optio quaerat quas similique tempora, tempore! Dolores excepturi optio repudiandae totam! Sequi." />
                <Splitter />
                <Hint hint="**A**СК**ВН" />
                <Splitter />
                <Variants userVariants={wrongAnswers}/>
            </div>
        )
    }
});

export default GameContainer;