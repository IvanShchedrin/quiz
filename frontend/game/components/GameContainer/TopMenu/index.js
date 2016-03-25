import React from 'react';

import './style.styl'

export default class TopMenu extends React.Component{

    render() {
        return(
            <div className="top_menu">
                <i className="fa fa-bars"></i>
                <span className="menu-middle">{'Викторина' + (this.props.theme == '' ? '' : ' | ' + this.props.theme.toUpperCase())}</span>
                <i className="fa fa-commenting-o"></i>
            </div>
        )
    }
};