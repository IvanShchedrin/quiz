import React from 'react';

class Variants extends React.Component{
    render() {
        var wrongAnswers = this.props.userVariants.map((userVariant, i) => {
            return <UserVariant userVariant={userVariant} key={i}/>
        });

        return(
            <div className="variants">
                {wrongAnswers}
            </div>
        )
    }
}

class UserVariant extends React.Component{
    render() {
        return(
            <li className="user-variant">
                {this.props.userVariant.name}: {this.props.userVariant.answer.toUpperCase()}
            </li>
        )
    }
}

export default Variants;