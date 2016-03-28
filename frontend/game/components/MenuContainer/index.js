import React from 'react'

import UserInfo from './UserInfo'
import MenuList from './MenuList'
import BottomMenu from './BottomMenu'

import './style.styl'

export default class MenuContainer extends React.Component{

    render() {
        return(
            <div className="menu-container">
                <UserInfo name={this.props.name} score={this.props.score} />
                <MenuList />
                <BottomMenu />
            </div>
        )
    }

}