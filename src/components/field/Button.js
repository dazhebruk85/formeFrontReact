import React, {Component}from 'react';

class Button extends Component {

    render() {
        return (
            <div className="btn-group mr-2" role="group">
                <input ref={this.props.id}
                       id={this.props.id}
                       type="button"
                       value={this.props.value}
                       className="btn btn-primary"
                       onClick={this.props.onClick}
                       style={this.props.style}/>
            </div>
        )
    }
}

export default Button;