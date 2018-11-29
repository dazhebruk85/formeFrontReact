import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../../media/data/close.png';
import ErrorModal from '../error/ErrorModal';
import cookie from 'react-cookies';
import axios from 'axios';
import * as Const from '../../../Const';
import { Redirect } from 'react-router-dom'
import infoPng from '../../../media/data/info.png';

class ChangePasswordModal extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            visible:false,
            oldPassword:'',
            newPassword:'',
            newPasswordRepeat:'',
            errors: [],
            redirectToLoginPage:false,
            succuessChangeModalVisible:false
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.closeSuccessChangeModal = this.closeSuccessChangeModal.bind(this);
        this.successChangePasswordAction = this.successChangePasswordAction.bind(this);
    }

    closeModal() {
        this.setState({
            visible : false,
            oldPassword:'',
            newPassword:'',
            newPasswordRepeat:'',
            errors: [],
            redirectToLoginPage:false,
            succuessChangeModalVisible:false
        });
    }

    closeSuccessChangeModal() {
        this.setState({
            succuessChangeModalVisible:false,
            redirectToLoginPage:true
        });
    }

    successChangePasswordAction() {
        this.setState({
            succuessChangeModalVisible:true
        });
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
                this.successChangePasswordAction();
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
            <Modal style={{marginTop:"20px"}} visible={this.state.visible} effect="fadeInDown">
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
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Введите старый пароль</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="oldPassword" className="form-control" type="text" value={this.state.oldPassword} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2" htmlFor="passwordTextbox">Введите новый пароль</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="newPassword" className="form-control" type="password" value={this.state.newPassword} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2" htmlFor="passwordTextbox">Повторите новый пароль</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <input id="newPasswordRepeat" className="form-control" type="password" value={this.state.newPasswordRepeat} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2"></label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <div style={{paddingRight:'0px'}} className="btn-toolbar pull-right" role="toolbar">
                                        <div className="btn-group mr-2" role="group">
                                            <input id="saveButton" type="button" value="Ок" className="btn btn-primary" onClick={this.changePassword}/>
                                        </div>
                                        <div className="btn-group mr-2" role="group">
                                            <input id="closeButton" type="button" value="Отмена" className="btn btn-primary" onClick={() => this.closeModal()}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors}/>

                <Modal style={{marginTop:"20px"}} visible={this.state.succuessChangeModalVisible} effect="fadeInDown">
                    <div className="panel panel-default" style={{width:'500px',height:'200px',marginBottom:'0px'}}>
                        <div className="panel-heading" style={{height:'45px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                <tr>
                                    <td style={{width:'90%'}}>
                                        <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Информация</label>
                                    </td>
                                    <td style={{width:'10%',alignItems:'right'}}>
                                        <img alt='' onClick={() => this.closeSuccessChangeModal()} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="panel-body" style={{height:'100px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                    <tr>
                                        <td style={{width:'7%'}}><img alt='' src={infoPng} style={{height:"24px",width:"24px"}}/></td>
                                        <td style={{width:'93%'}}>Вы сменили пароль, необходимо заново войти в систему под новым паролем</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <div className="btn-group mr-2" role="group">
                                <input id="okButton" type="button" value="Ок" className="btn btn-primary" onClick={() => this.closeSuccessChangeModal()}/>
                            </div>
                        </div>
                    </div>
                </Modal>

            </Modal>
            )
    }
}

export default ChangePasswordModal;