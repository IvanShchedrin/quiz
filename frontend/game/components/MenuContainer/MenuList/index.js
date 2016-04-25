import './styles.styl'

import React from 'react'

export default class MenuList extends React.Component{

    logout() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/logout', true);
        xhr.send();
    }

    render() {
        var items = [
            {
                title: 'На главную',
                link: '/',
                icon: <i className="fa fa-home"></i>
            },
            {
                title: 'Личный кабинет',
                link: '/profile',
                icon: <i className="fa fa-user"></i>
            },
            {
                title: 'Предложить вопрос',
                link: '#',
                icon: <i className="fa fa-plus-circle"></i>
            },
            {
                title: 'Помощь',
                link: '#',
                icon: <i className="fa fa-question-circle"></i>
            }
        ];

        var menuList = items.map(function(item, i) {
            return(
                <li key={i}>
                    <a href={item.link}>
                        {item.icon}
                        {item.title}
                    </a>
                </li>
            )
        });

        return(
            <div className="menu-list">
                <ul>
                    {menuList}
                    <li onClick={this.logout} key="99"><a href="#"><i className="fa fa-power-off"></i>Выйти</a></li>
                </ul>
            </div>
        )
    }

}