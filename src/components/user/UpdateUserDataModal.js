import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import cookie from 'react-cookies';
import axios from 'axios';
import * as Const from '../../Const';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import './../../media/datePicker/react-datepicker.css';

class UpdateUserDataModal extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            visible:false,
            errors: [],
            closeAction:props.closeAction,
            fio:"",
            birthDate: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.closeAction = props.closeAction
    }

    handleChange(event, field) {
        if (field !== null && field !== undefined) {
            this.setState({
                [field]: event
            });
        } else {
            const value = event.target.value;
            const id = event.target.id;

            this.setState({
                [id]: value
            });
        }
    }

    setErrors(errors) {
        this.setState({
            errors: errors
        });
    }

    closeModal() {
        this.setState({
            visible : false,
            errors: [],
            fio:"",
            birthDate: null
        });
        this.closeAction()
    }

    render() {
        return(
            <Modal visible={this.state.visible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'540px',height:'250px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Изменить данные пользователя</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={() => this.closeModal()} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2" htmlFor="loginTextbox">ФИО</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="fio" className="form-control" type="text" value={this.state.fio} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Дата рождения</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <DatePicker todayButton='Today'
                                                ref='birthDate'
                                                className="form-control"
                                                id='birthDate'
                                                selected={this.state.birthDate}
                                                onChange={(date) => this.handleChange(date, "birthDate")}
                                                dateFormat="dd.MM.yyyy"
                                                isClearable={true}/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default UpdateUserDataModal;
