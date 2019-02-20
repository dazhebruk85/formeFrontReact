import React, {Component}from 'react';

export default class Button extends Component {

    render() {

        let buttonStyle = this.props.style ? this.props.style : {};
        if (this.props.visible !== undefined) {
            buttonStyle['display'] = this.props.visible ? '':'none';
        }

        return (
            <input type="button"
                   value={this.props.value}
                   className="btn btn-primary btn-sm"
                   onClick={this.props.onClick}
                   style={buttonStyle}
                   disabled={this.props.disabled}/>
        )
    }
}