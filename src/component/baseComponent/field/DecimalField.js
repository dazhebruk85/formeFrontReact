import {Component} from "react";
import React from "react";
import * as CommonUtils from "../../../utils/CommonUtils";

export default class DecimalField extends Component {


    decimalOnChange(event) {
        let decimalValue = event.target.value;
        if (decimalValue) {
            if (CommonUtils.BigDecimalRegExp.test(decimalValue)) {
                this.props.onChange(decimalValue);
            }
        } else {
            this.props.onChange("")
        }
    }

    render() {

        let decimalStyle = this.props.style ? this.props.style : {};
        decimalStyle.textAlign = 'right';

        let decimalValue = this.props.value;
        if (typeof decimalValue === 'number') {
            decimalValue = decimalValue.toFixed(2)
        } else if (typeof decimalValue === 'string') {
            decimalValue = decimalValue ? (isNaN(decimalValue) ? decimalValue : parseFloat(decimalValue).toFixed(2)) : decimalValue
        }

        return (
            <div className="col-sm-10" style={{width:this.props.width, paddingRight:'0px'}}>
                <input id={this.props.id}
                       className="form-control input-sm"
                       value={decimalValue}
                       onChange={(event) => this.decimalOnChange(event)}
                       placeholder={this.props.placeholder}
                       maxLength={this.props.maxLength}
                       style={decimalStyle}
                       type="text"
                       disabled={this.props.disabled}/>
            </div>
        )
    }
}