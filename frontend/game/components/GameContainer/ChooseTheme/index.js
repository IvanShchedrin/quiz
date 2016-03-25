import React from 'react';

export default class ChooseTheme extends React.Component{

    constructor(props) {
        super(props);
        this.chooseTheme = this.chooseTheme.bind(this);
    }

    chooseTheme(elem) {
        this.props.emit('choosen theme', elem.target.innerHTML);
    }

    render() {
        var themes = this.props.themes.map((theme, i) => {
            return(
                <li className="theme_to_choose" onClick={this.chooseTheme} key={i}>
                    {theme}
                </li>
            )
        });


        return(
            <div className="themes_to_choose">
                <ul>
                    {themes}
                </ul>
            </div>
        );
    }

}