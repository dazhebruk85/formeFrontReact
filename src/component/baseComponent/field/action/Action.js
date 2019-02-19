import React, {Component} from 'react';
import '../../../../media/common/action/entityAction.css';

class Action extends Component {

    render() {

        return (
            <div className={'entityActionDiv'}>
                <img onClick={this.props.onClick} title={this.props.title}  alt={this.props.alt} src={this.props.src} className={'entityActionImg'}/>
            </div>
        )
    }
}

export default Action;