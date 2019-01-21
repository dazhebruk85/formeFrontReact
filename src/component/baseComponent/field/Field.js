import React, {Component}from 'react';
import * as Const from '../../../Const';
import DatePicker from 'react-datepicker';
import './../../../media/datePicker/react-datepicker.css';

class Field extends Component {

    constructor(props) {
        super(props);

        this.checkBoxClick = this.checkBoxClick.bind(this);
        this.changeAction = props.onChange
    }

    checkBoxClick(event) {
        let trNode = event.target.parentNode.parentNode;
        let checkBoxNode = trNode.children[0].children[0].children[0];
        checkBoxNode.click()
    }

    render() {
        switch(this.props.type) {
            case Const.TEXTFIELD:
                return (
                    <div className="form-group">
                        {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                        <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                            <input className="form-control input-sm"
                                   value={this.props.value}
                                   onChange={this.props.onChange}
                                   placeholder={this.props.placeholder}
                                   maxLength={this.props.maxLength}
                                   style={this.props.style}
                                   type="text"
                                   disabled={this.props.disabled}/>
                        </div>
                    </div>
                );
            case Const.DECIMALFIELD:
                let decimalStyle = this.props.style ? this.props.style : {};
                decimalStyle.textAlign = 'right';
                return (
                    <div className="form-group">
                        {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                        <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                            <input className="form-control input-sm"
                                   value={this.props.value}
                                   onChange={this.props.onChange}
                                   placeholder={this.props.placeholder}
                                   maxLength={this.props.maxLength}
                                   style={decimalStyle}
                                   type="text"
                                   disabled={this.props.disabled}/>
                        </div>
                    </div>
                );
            case Const.PASSWORD:
                return (
                    <div className="form-group">
                        {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                        <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                            <input className="form-control input-sm"
                                   value={this.props.value}
                                   onChange={this.props.onChange}
                                   placeholder={this.props.placeholder}
                                   maxLength={this.props.maxLength}
                                   style={this.props.style}
                                   type="password"/>
                        </div>
                    </div>
                );
            case Const.TEXTAREA:
                return (
                    <div className="form-group" style={{width:'99%'}}>
                        {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                        <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                            <textarea className="form-control input-sm"
                                      value={this.props.value}
                                      onChange={this.props.onChange}
                                      placeholder={this.props.placeholder}
                                      maxLength={this.props.maxLength}
                                      style={this.props.style}/>
                        </div>
                    </div>
                );
            case Const.DATEPICKER:
                let dateValue = (this.props.value && this.props.value !== undefined) ? new Date(this.props.value) : undefined;
                return (
                    <div className="form-group">
                        {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                        <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                            <DatePicker className="form-control input-sm" todayButton='Today'
                                        selected={dateValue}
                                        onChange={this.props.onChange}
                                        placeholder={this.props.placeholder}
                                        style={this.props.style}
                                        dateFormat="dd.MM.yyyy"
                                        isClearable={true}
                                        disabled={this.props.disabled}/>
                        </div>
                    </div>
                );
            case Const.CHECKBOX:
                let checkBoxStyle = this.props.style ? this.props.style : {};
                checkBoxStyle.cursor = 'pointer';
                checkBoxStyle.marginTop = '10px';
                return (
                    <div className="form-group" style={{marginBottom:'0px'}}>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="col-sm-10" style={{paddingRight:'0px'}}>
                                        <input type="checkbox"
                                               checked={this.props.checked}
                                               value={this.props.checked}
                                               onChange={this.props.onChange}
                                               style={checkBoxStyle}/>
                                    </div>
                                </td>
                                <td style={{width:this.props.labelWidth}}>
                                    {this.props.label ? <label onClick={(event) => this.checkBoxClick(event)} style={{cursor:'pointer',textAlign:'left',width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return (
                    null
                );
        }
    }
}

export default Field;