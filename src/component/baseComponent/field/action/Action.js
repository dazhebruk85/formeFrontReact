import React, {Component}from 'react';

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