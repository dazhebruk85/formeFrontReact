import {Component} from "react";
import React from "react";

export default class PasswordField extends Component {

    render() {
        return (
            <div className="col-sm-10" style={{width:this.props.width, paddingRight:'0px'}}>
                <input id={this.props.id}
                       className="form-control input-sm"
                       value={this.props.value}
                       onChange={this.props.onChange}
                       placeholder={this.props.placeholder}
                       maxLength={this.props.maxLength}
                       style={this.props.style}
                       type="password"
                       disabled={this.props.disabled}/>
            </div>
        )
    }
}