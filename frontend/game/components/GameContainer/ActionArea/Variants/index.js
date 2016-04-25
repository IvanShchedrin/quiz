import './styles.styl'

import React, {PropTypes} from 'react';

class Variants extends React.Component{

    render() {
        var wrongAnswers = this.props.userVariants.map((userVariant, i) => {
            return(
                <li key={i} style={userVariant.style}>
                    {userVariant.name}: {userVariant.answer.toUpperCase()}
                </li>
            )
        });

        return(
            <div className="variants">
                <ul>
                    {wrongAnswers}
                </ul>
            </div>
        )
    }
}

export default Variants;