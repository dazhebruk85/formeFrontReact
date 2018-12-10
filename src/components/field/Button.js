import React, {Component}from 'react';

class Button extends Component {

    render() {

        let buttonStyle = this.props.style ? this.props.style : {};
        if (this.props.visible !== undefined) {
            buttonStyle['display'] = this.props.visible ? '':'none';
        }

        return (
            <div className="btn-group mr-2" role="group">
                <input ref={this.props.id}
                       id={this.props.id}
                       type="button"
                       value={this.props.value}
                       className="btn btn-primary btn-sm"
                       onClick={this.props.onClick}
                       style={buttonStyle}
                       />
            </div>
        )
    }
}

export default Button;