import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import cookie from 'react-cookies';
import axios from 'axios';
import * as Const from '../../Const';
import MultiPopup from "../modal/MultiPopup";
import UniversalField from './../field/UniversalField'
import Button from './../field/Button'
import ErrorModal from '../../components/modal/ErrorModal';

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
            passportNumber: '',
            passportIssuedBy: '',
            regAddress: '',
            successInfoMessages: []
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
            if (res.data.errors.length > 0) {
                this.setErrors(res.data.errors)
            } else {
                this.setUserData({data: res.data.params});
            }
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
            passportNumber: '',
            passportIssuedBy: '',
            regAddress: '',
            successInfoMessages: []
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
        if (!this.state.passportNumber) {
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
            let propsToSave = this.state
            propsToSave['userId'] = cookie.load('userId')
            propsToSave['birthDateLong'] = propsToSave.birthDate.getTime()
            let listPostEvent = axios.post(Const.APP_URL, {
                context: Const.USER_CONTEXT,
                action: Const.ENTITY_SAVE,
                sessionId: cookie.load('sessionId'),
                params: propsToSave
            });
            listPostEvent.then(res => {
                if (res.data.errors.length > 0) {
                    this.setErrors(res.data.errors)
                } else {
                    this.setSuccessChangePassword([{code:'INFO',message:'Данные пользователя сохранены'}])
                }
            });
            listPostEvent.catch(error => {
                if (!error.status) {
                    this.setErrors([{code:'SYS',message:'APP сервер недоступен'}])
                } else {
                    this.setErrors([{code:'SYS',message:'Непредвиденная ошибка на сервере'}])
                }
            });
        }
    }

    setSuccessChangePassword(messages) {
        this.setState({
            successInfoMessages: messages
        });
    }

    clearSuccessInfoMessages() {
        this.setState({
            successInfoMessages: []
        });
        this.closeModal()
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
                    <div className="panel-body" style={{overflow:'auto'}}>
                        <form className="form-horizontal">
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='ФИО' type={Const.TEXTFIELD} id='fio' value={this.state.fio} onChange={this.handleChange} placeholder='ФИО' maxLength={255}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Дата рождения' type={Const.DATEPICKER} id='birthDate' value={this.state.birthDate} onChange={(date) => this.handleChange(date, "birthDate")} placeholder='Дата рождения'/>
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
                                                    <input placeholder="Номер" id="passportNumber" maxLength={6} className="form-control" type="text" value={this.state.passportNumber} onChange={this.handleChange}/>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <UniversalField style={{resize:'none',height:'75px'}} labelWidth='220px' fieldWidth='300px' label='выдан' type={Const.TEXTAREA} id='passportIssuedBy' value={this.state.passportIssuedBy} onChange={this.handleChange} placeholder='Кем выдан паспорт' maxLength={255}/>
                            <UniversalField style={{resize:'none',height:'75px'}} labelWidth='220px' fieldWidth='300px' label='Адрес регистрации' type={Const.TEXTAREA} id='regAddress' value={this.state.regAddress} onChange={this.handleChange} placeholder='Адрес регистрации' maxLength={255}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Телефон' type={Const.TEXTFIELD} id='phone' value={this.state.phone} onChange={this.handleChange} placeholder='Телефон' maxLength={100}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Email' type={Const.TEXTFIELD} id='email' value={this.state.email} onChange={this.handleChange} placeholder='Email' maxLength={100}/>
                            <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                                <Button id="UUDMokButton" value="Ок" onClick={() => this.saveUserData()}/>
                                <Button id="UUDMcancelButton" value="Отмена" onClick={() => this.closeModal()}/>
                            </div>
                         </form>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <MultiPopup popupData={this.state.successInfoMessages}
                            popupType={Const.INFO_POPUP}
                            closeAction={this.clearSuccessInfoMessages.bind(this)}/>
            </Modal>
        )
    }
}

export default UpdateUserDataModal;
