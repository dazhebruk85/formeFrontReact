import React, {Component} from 'react';
import '../../../../media/common/action/entityAction.css';

class SubAction extends Component {

    render() {

        return (
            <div className={'entitySubActionDiv'} onClick={this.props.onClick}>
                {this.props.text}
            </div>
        )
    }
}

export default SubAction;