import {Component} from "react";
import React from "react";
import DatePicker from 'react-datepicker';
import './../../../media/datePicker/react-datepicker.css';

export default class DateField extends Component {

    render() {
        let dateValue = (this.props.value && this.props.value !== undefined) ? new Date(this.props.value) : undefined;
        return (
            <div className="col-sm-10" style={{width:this.props.width, paddingRight:'0px'}}>
                <DatePicker className="form-control input-sm" todayButton='Today'
                            selected={dateValue}
                            onChange={this.props.onChange}
                            placeholder={this.props.placeholder}
                            style={this.props.style}
                            dateFormat="dd.MM.yyyy"
                            isClearable={true}
                            disabled={this.props.disabled}
                            dropdownMode={'scroll'}
                            showMonthDropdown
                            showYearDropdown/>
            </div>
        )
    }
}