import React, {Component}from 'react';
import * as Const from '../../../Const';
import DatePicker from 'react-datepicker';
import './../../../media/datePicker/react-datepicker.css';

class Field extends Component {

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
                                   type="text"/>
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
                    <div className="form-group">
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
                return (
                    <div className="form-group">
                        {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                        <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                            <DatePicker className="form-control input-sm" todayButton='Today'
                                        selected={this.props.value}
                                        onChange={this.props.onChange}
                                        placeholder={this.props.placeholder}
                                        style={this.props.style}
                                        dateFormat="dd.MM.yyyy"
                                        isClearable={true}/>
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
                                               onChange={this.props.onChange}
                                               style={checkBoxStyle}/>
                                    </div>
                                </td>
                                <td style={{width:this.props.labelWidth}}>
                                    {this.props.label ? <label style={{textAlign:'left',width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                )
            default:
                return (
                    null
                );
        }
    }
}

export default Field;