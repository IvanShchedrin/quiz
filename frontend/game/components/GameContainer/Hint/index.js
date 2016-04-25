import './styles.styl'

import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class Hint extends React.Component {

    render() {
        var style = this.props.hint.length > 19 ? {letterSpacing: '0rem'} : {};

        return(
            <div className="hint" key={15} style={style}>{this.props.hint}</div>
        )
    }
}

Hint.propTypes = { hint: PropTypes.string };