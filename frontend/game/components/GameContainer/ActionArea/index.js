import './styles.styl'

import React, {PropTypes} from 'react';

import Variants from './Variants'
import ChooseTheme from './ChooseTheme'
import Gratters from './Gratters'
import Timer from './Timer'
import Warning from './Warning'

class ActionArea extends React.Component{

    render() {
        var warning = this.props.warning !== '' ? <Warning warning={this.props.warning} /> : null;
        var themes = this.props.themesToChoose.length === 0 ? null :
            <ChooseTheme themes={this.props.themesToChoose} emit={this.props.emit} />;

        return(
            <div className="action-area">
                <Variants userVariants={this.props.userVariants} />
                {themes}
                <Timer timeLeftStart={this.props.timeLeft}/>
                <Gratters gratters={this.props.gratters}/>
                {warning}
            </div>
        )
    }
}

export default ActionArea;