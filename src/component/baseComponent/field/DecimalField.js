import {Component} from "react";
import React from "react";

export default class DecimalField extends Component {

    render() {

        let decimalStyle = this.props.style ? this.props.style : {};
        decimalStyle.textAlign = 'right';

        return (
            <div className="col-sm-10" style={{width:this.props.width, paddingRight:'0px'}}>
                <input id={this.props.id}
                       className="form-control input-sm"
                       value={this.props.value}
                       onChange={this.props.onChange}
                       placeholder={this.props.placeholder}
                       maxLength={this.props.maxLength}
                       style={decimalStyle}
                       type="text"
                       disabled={this.props.disabled}/>
            </div>
        )
    }
}