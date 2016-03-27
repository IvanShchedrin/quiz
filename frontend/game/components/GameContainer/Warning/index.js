import React from 'react'

export default class Warning extends React.Component {

    render() {
        return (
            <div>
                {this.props.warning.text}
            </div>
        )
    }

}