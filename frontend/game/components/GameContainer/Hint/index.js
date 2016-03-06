import React from 'react';

var Hint = React.createClass({
    render() {
        return(
            <div className="hint">
                <span className="hint-letters">{this.props.hint}</span>
            </div>
        )
    }
});

export default Hint;