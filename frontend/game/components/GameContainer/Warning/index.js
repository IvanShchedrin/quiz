import React from 'react'

import './styles.styl'

export default class Warning extends React.Component {

    render() {
        return (
            <span>{this.props.warning}</span>
        )
    }

}