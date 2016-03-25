import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'

//import './styles.styl'

export default class Hint extends React.Component {

    render() {
        return(
            <span key={15}>{this.props.hint}</span>
        )
    }
}

Hint.propTypes = { hint: PropTypes.string };