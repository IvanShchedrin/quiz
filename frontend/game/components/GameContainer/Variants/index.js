import React from 'react';

var Variants = React.createClass({
    render() {
        var ids = 101;
        var wrongAnswers = this.props.userVariants.map(userVariant => {
            return <UserVariant userVariant={userVariant} key={ids++}/>
        });

        return(
            <div className="variants">
                {wrongAnswers}
            </div>
        )
    }
});

var UserVariant = React.createClass({
    render() {
        return(
            <li className="user-variant">
                {this.props.userVariant.name}: {this.props.userVariant.answer.toUpperCase()}
            </li>
        )
    }
});

export default Variants;