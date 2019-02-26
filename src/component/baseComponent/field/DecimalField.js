import {Component} from "react";
import React from "react";
import * as CommonUtils from "../../../utils/CommonUtils";

export default class DecimalField extends Component {

    isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    decimalOnChange(decimalValue) {
        if (decimalValue) {
            if (CommonUtils.BigDecimalRegExp.test(decimalValue)) {
                this.props.onChange(decimalValue)
            }
        } else {
            this.props.onChange("")
        }
    }

    render() {

        let decimalStyle = this.props.style ? this.props.style : {};
        decimalStyle.textAlign = 'right';
/*
        let decimalValue = "";
        if (this.props.value) {
            if (typeof this.props.value == 'number') {
                decimalValue = this.props.value.toFixed(2)
            } else {
                let strNumber = this.props.value;
                strNumber = strNumber.replace(/[,]+/g, '.');
                if (!isNaN(strNumber)) {
                    decimalValue = CommonUtils.strToBigDecimal(strNumber)
                }
            }
        }
*/

        return (
            <div className="col-sm-10" style={{width:this.props.width, paddingRight:'0px'}}>
                <input id={this.props.id}
                       className="form-control input-sm"
                       value={this.props.value}
                       onChange={(event) => this.decimalOnChange(event.target.value)}
                       //onKeyPress={() => this.isNumber()}
                       placeholder={this.props.placeholder}
                       maxLength={this.props.maxLength}
                       style={decimalStyle}
                       type="text"
                       disabled={this.props.disabled}/>
            </div>
        )
    }
}