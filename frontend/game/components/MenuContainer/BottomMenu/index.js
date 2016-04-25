import './styles.styl'

import React from 'react'

export default class BottomMenu extends React.Component{

    render() {
        return(
            <div className="bottom-menu">
                <span className="link-icons">
                    <a href="https://github.com/oktava6/quiz" target="_blank"><i className="fa fa-github"></i></a>
                    <a href="https://vk.com/ivan_shedrin" target="_blank"><i className="fa fa-vk" aria-hidden="true"></i></a>
                    <a href="https://vk.com/ivan_shedrin" target="_blank"><i className="fa fa-twitter" aria-hidden="true"></i></a>
                    <a href="https://vk.com/ivan_shedrin" target="_blank"><i className="fa fa-instagram" aria-hidden="true"></i></a>
                </span>
                <span className="signature">Oktava - 2016 | powered by <a href="https://github.com/oktava6/quiz">open source</a></span>
            </div>
        )
    }

}