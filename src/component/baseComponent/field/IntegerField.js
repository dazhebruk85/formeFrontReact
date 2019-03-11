import {Component} from "react";
import React from "react";
import * as CommonUtils from "../../../utils/CommonUtils";

export default class IntegerField extends Component {


    integerOnChange(event) {
        let integerValue = event.target.value;
        if (integerValue) {
            if (CommonUtils.IntegerRegExp.test(integerValue)) {
                this.props.onChange(integerValue);
            }
        } else {
            this.props.onChange("")
        }
    }

    render() {

        let integerStyle = this.props.style ? this.props.style : {};
        integerStyle.textAlign = 'right';

        let integerValue = this.props.value;
        if (typeof integerValue === 'string') {
            integerValue = integerValue ? (isNaN(integerValue) ? integerValue : parseFloat(integerValue)) : integerValue
        }

        return (
            <div className="col-sm-10" style={{width:this.props.width, paddingRight:'0px'}}>
                <input id={this.props.id}
                       className="form-control input-sm"
                       value={integerValue}
                       onChange={(event) => this.integerOnChange(event)}
                       placeholder={this.props.placeholder}
                       maxLength={this.props.maxLength}
                       style={integerStyle}
                       type="text"
                       disabled={this.props.disabled}/>
            </div>
        )
    }
}