import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import cookie from 'react-cookies';
import * as Const from '../../Const';
import { Redirect } from 'react-router-dom'
import MultiPopup from "../modal/MultiPopup";
import UniversalField from './../field/UniversalField'
import Button from './../field/Button'
import ErrorModal from '../../components/modal/ErrorModal';
import * as CommonUtils from "../../utils/CommonUtils";

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

    async changePassword(evt) {
        let errors = [];
        if (!this.state.oldPassword) {
            errors.push({code:'CHANGE_PASS_ERROR',message:'Необходимо ввести старый пароль'});
        }

        if (!this.state.newPassword) {
            errors.push({code:'CHANGE_PASS_ERROR',message:'Необходимо ввести новый пароль'});
        }

        if (!this.state.newPasswordRepeat) {
            errors.push({code:'CHANGE_PASS_ERROR',message:'Необходимо повторить новый пароль'});
        }

        if (this.state.newPassword  && this.state.newPasswordRepeat && this.state.newPassword !== this.state.newPasswordRepeat) {
            errors.push({code:'CHANGE_PASS_ERROR',message:'Введённые новые пароли не совпадают'});
        }

        if (errors.length > 0) {
            this.setState({errors: errors});
        } else {
            let params = {oldPassword:this.state.oldPassword,newPassword:this.state.newPassword,newPasswordRepeat:this.state.newPasswordRepeat};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHANGE_PASSWORD_CONTEXT,'',params,cookie.load('sessionId'));
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Вы сменили пароль, необходимо заново войти в систему под новым паролем'}]});
            }
        }
    }

    handleChange(event, fieldName) {
        const value = event.target.value;
        this.setState({
            [fieldName]: value
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
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Введите старый пароль' type={Const.PASSWORD} value={this.state.oldPassword} onChange={(event) => this.handleChange(event, 'oldPassword')} maxLength={20}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Введите новый пароль' type={Const.PASSWORD} value={this.state.newPassword} onChange={(event) => this.handleChange(event, 'newPassword')} maxLength={20}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Повторите новый пароль' type={Const.PASSWORD} value={this.state.newPasswordRepeat} onChange={(event) => this.handleChange(event, 'newPasswordRepeat')} maxLength={20}/>
                            <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                                <Button value="Ок" onClick={() => this.changePassword()}/>
                                <Button value="Отмена" onClick={() => this.closeModal()}/>
                            </div>
                        </form>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <MultiPopup popupData={this.state.successInfoMessages}
                            popupType={Const.INFO_POPUP}
                            closeAction={() => this.setState({successInfoMessages:[],redirectToLoginPage:true})}/>
            </Modal>
            )
    }
}

export default ChangePasswordModal;