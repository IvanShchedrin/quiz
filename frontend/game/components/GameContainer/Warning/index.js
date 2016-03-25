import React from 'react'

export default class Warning extends React.Component {

    render() {
        console.log(this);
        return (
            <div>
                {this.props.warning.text}
            </div>
        )
    }

}