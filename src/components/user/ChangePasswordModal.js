import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import cookie from 'react-cookies';
import axios from 'axios';
import * as Const from '../../Const';
import { Redirect } from 'react-router-dom'
import MultiPopup from "../modal/MultiPopup";
import UniversalField from './../field/UniversalField'
import Button from './../field/Button'

class ChangePasswordModal extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            visible:false,
            oldPassword:'',
            newPassword:'',
            newPasswordRepeat:'',
            errors: [],
            successInfoMessages: [],
            redirectToLoginPage:false,
            closeAction:props.closeAction
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.closeAction = props.closeAction
    }

    closeModal() {
        this.setState({
            visible : false,
            oldPassword:'',
            newPassword:'',
            newPasswordRepeat:'',
            errors: [],
            successInfoMessages: [],
            redirectToLoginPage:false,
            succuessChangeModalVisible:false
        });
        this.closeAction()
    }

    handleChange(event) {
        const value = event.target.value;
        const id = event.target.id;

        this.setState({
            [id]: value
        });
    }

    setErrors(errors) {
        this.setState({
            errors: errors
        });
    }

    clearErrors() {
        this.setState({
            errors: []
        });
    }

    setSuccessChangePassword(messages) {
        this.setState({
            successInfoMessages: messages
        });
    }

    clearSuccessInfoMessages() {
        this.setState({
            successInfoMessages: [],
            redirectToLoginPage:true
        });
    }

    changePassword(evt) {
        if (!this.state.oldPassword) {
            this.setErrors([{code:'CHANGE_PASS_ERROR',message:'Необходимо ввести старый пароль'}]);
            return;
        }

        if (!this.state.newPassword) {
            this.setErrors([{code:'CHANGE_PASS_ERROR',message:'Необходимо ввести новый пароль'}]);
            return;
        }

        if (!this.state.newPasswordRepeat) {
            this.setErrors([{code:'CHANGE_PASS_ERROR',message:'Необходимо повторить новый пароль'}]);
            return;
        }

        if (this.state.newPassword !== this.state.newPasswordRepeat) {
            this.setErrors([{code:'CHANGE_PASS_ERROR',message:'Введённые новые пароли не совпадают'}]);
            return;
        }

        let changePasswordPostEvent = axios.post(Const.APP_URL, {
            context: Const.USER_CONTEXT,
            action: Const.USER_PASSWORD_CHANGE_ACTION,
            sessionId: cookie.load('sessionId'),
            params: {
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
                newPasswordRepeat: this.state.newPasswordRepeat
            }
        });
        changePasswordPostEvent.then(res => {
            if (res.data.errors.length > 0) {
                this.setErrors(res.data.errors)
            } else {
                this.setSuccessChangePassword([{code:'INFO',message:'Вы сменили пароль, необходимо заново войти в систему под новым паролем'}])
            }
        });
        changePasswordPostEvent.catch(error => {
            if (!error.status) {
                this.setErrors([{code:'SYS',message:'APP сервер недоступен'}])
            } else {
                this.setErrors([{code:'SYS',message:'Непредвиденная ошибка на сервере'}])
            }
        });
    }

    render() {
        const { redirectToLoginPage } = this.state;

        if (redirectToLoginPage) {
            return <Redirect to='/front'/>;
        }

        return (
            <Modal visible={this.state.visible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'540px',height:'250px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Смена пароля</label>
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
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Введите старый пароль' type={Const.PASSWORD} id='oldPassword' value={this.state.oldPassword} onChange={this.handleChange} maxLength={20}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Введите новый пароль' type={Const.PASSWORD} id='newPassword' value={this.state.newPassword} onChange={this.handleChange} maxLength={20}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Повторите новый пароль' type={Const.PASSWORD} id='newPasswordRepeat' value={this.state.newPasswordRepeat} onChange={this.handleChange} maxLength={20}/>
                            <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                                <Button id="CPMokButton" value="Ок" onClick={this.changePassword}/>
                                <Button id="CPMokButton" value="Отмена" onClick={() => this.closeModal()}/>
                            </div>
                        </form>
                    </div>
                </div>
                <MultiPopup popupData={this.state.errors}
                            popupType={Const.ERROR_POPUP}
                            closeAction={this.clearErrors.bind(this)}/>
                <MultiPopup popupData={this.state.successInfoMessages}
                            popupType={Const.INFO_POPUP}
                            closeAction={this.clearSuccessInfoMessages.bind(this)}/>
            </Modal>
            )
    }
}

export default ChangePasswordModal;