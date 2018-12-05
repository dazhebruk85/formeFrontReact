import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import cookie from 'react-cookies';
import axios from 'axios';
import * as Const from '../../Const';
import MultiPopup from "../modal/MultiPopup";

import DatePicker from 'react-datepicker';
import moment from 'moment';
import './../../media/datePicker/react-datepicker.css';

class UpdateUserDataModal extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            visible:props.visible,
            errors: [],
            closeAction:props.closeAction,
            fio:'',
            birthDate: undefined,
            phone: '',
            email: '',
            passportSeries: '',
            passportNum: '',
            passportIssuedBy: '',
            regAddress: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.saveUserData = this.saveUserData.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.getUserData()
        }
    }

    getUserData() {
        let listPostEvent = axios.post(Const.APP_URL, {
            context: Const.USER_CONTEXT,
            action: Const.ENTITY_GET,
            sessionId: cookie.load('sessionId'),
            params: {
                userId: cookie.load('userId')
            }
        });
        listPostEvent.then(res => {
            this.setUserData({data: res.data.params});
        });
        listPostEvent.catch(error => {
            if (!error.status) {
                this.setErrors([{code:'SYS',message:'APP сервер недоступен'}])
            } else {
                this.setErrors([{code:'SYS',message:'Непредвиденная ошибка на сервере'}])
            }
        });
    }

    setUserData(props) {
        let propsToChange = {}
        for (var key in props.data) {
            if (props.data.hasOwnProperty(key)) {
                if ("birthDate" === key) {
                    if (props.data[key]) {
                        propsToChange[key] = new Date(props.data[key]);
                    }
                } else {
                    propsToChange[key] = props.data[key] ? props.data[key] : '';
                }
            }
        };
        this.setState(propsToChange);
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
            fio:'',
            birthDate: undefined,
            phone: '',
            email: '',
            passportSeries: '',
            passportNum: '',
            passportIssuedBy: '',
            regAddress: ''
        });
        this.closeAction()
    }

    clearErrors() {
        this.setState({
            errors: []
        });
    }

    saveUserData() {
        let errors = []
        if (!this.state.fio) {
            errors.push({code:'',message:'Необходимо заполнить ФИО'})
        }
        if (!this.state.birthDate) {
            errors.push({code:'',message:'Необходимо заполнить дату рождения'})
        }
        if (!this.state.phone) {
            errors.push({code:'',message:'Необходимо заполнить телефон'})
        }
        if (!this.state.email) {
            errors.push({code:'',message:'Необходимо заполнить email'})
        }
        if (!this.state.passportSeries) {
            errors.push({code:'',message:'Необходимо заполнить серию паспорта'})
        }
        if (!this.state.passportNum) {
            errors.push({code:'',message:'Необходимо заполнить номер паспорта'})
        }
        if (!this.state.passportIssuedBy) {
            errors.push({code:'',message:'Необходимо заполнить орган, выдавший паспорт'})
        }
        if (!this.state.regAddress) {
            errors.push({code:'',message:'Необходимо заполнить адрес регистрации'})
        }
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {

        }
    }

    render() {
        return(
            <Modal visible={this.state.visible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'540px',height:'540px',marginBottom:'0px'}}>
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
                                <label style={{width:'220px'}} className="control-label col-sm-2">ФИО</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="fio" maxLength={255} className="form-control" type="text" value={this.state.fio} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">Дата рождения</label>
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
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">Паспорт</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input style={{width:'100px'}} placeholder="Серия" id="passportSeries" maxLength={4} className="form-control" type="text" value={this.state.passportSeries} onChange={this.handleChange}/>
                                                </td>
                                                <td style={{width:'10px'}}></td>
                                                <td>
                                                    <input placeholder="Номер" id="passportNum" maxLength={6} className="form-control" type="text" value={this.state.passportNum} onChange={this.handleChange}/>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">выдан</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <textarea style={{resize:'none',height:'75px'}} id="passportIssuedBy" maxLength={255} className="form-control" value={this.state.passportIssuedBy} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">Адрес регистрации</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <textarea style={{resize:'none',height:'75px'}} id="regAddress" maxLength={255} className="form-control" value={this.state.regAddress} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">Телефон</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="phone" maxLength={100} className="form-control" type="text" value={this.state.phone} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">Email</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="email" maxLength={100} className="form-control" type="text" value={this.state.email} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                                <div className="btn-group mr-2" role="group">
                                    <input id="UUDMokButton" type="button" value="Ок" className="btn btn-primary" onClick={() => this.saveUserData()}/>
                                </div>
                                <div className="btn-group mr-2" role="group">
                                    <input id="UUDMcancelButton" type="button" value="Отмена" className="btn btn-primary" onClick={() => this.closeModal()}/>
                                </div>
                            </div>
                         </form>
                    </div>
                </div>
                <MultiPopup popupData={this.state.errors}
                            popupType={Const.ERROR_POPUP}
                            closeAction={this.clearErrors.bind(this)}/>
            </Modal>
        )
    }
}

export default UpdateUserDataModal;
