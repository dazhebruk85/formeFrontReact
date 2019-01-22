import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import cookie from 'react-cookies';
import * as Const from '../../../Const';
import { Redirect } from 'react-router-dom'
import InfoModal from "../../baseComponent/modal/InfoModal";
import Field from '../../baseComponent/field/Field'
import Button from './../../baseComponent/field/Button'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as CommonUtils from "../../../utils/CommonUtils";

class ChangePasswordModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            successInfoMessages:[],
            redirectToLoginPage:false,
            closeAction:props.closeAction,
            fields:{
                common:{
                    oldPassword:'',
                    newPassword:'',
                    newPasswordRepeat:'',
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.closeAction = props.closeAction
    }

    closeModal() {
        this.setState({
            errors: [],
            successInfoMessages: [],
            redirectToLoginPage:false,
            fields:{
                ...this.state.fields,
                common:{
                    oldPassword:'',
                    newPassword:'',
                    newPasswordRepeat:'',
                }
            }
        });
        this.closeAction()
    }

    async changePassword(evt) {
        let errors = [];
        if (!this.state.fields.common.oldPassword) {errors.push({code:'CHANGE_PASS_ERROR',message:'Необходимо ввести старый пароль'})}
        if (!this.state.fields.common.newPassword) {errors.push({code:'CHANGE_PASS_ERROR',message:'Необходимо ввести новый пароль'})}
        if (!this.state.fields.common.newPasswordRepeat) {errors.push({code:'CHANGE_PASS_ERROR',message:'Необходимо повторить новый пароль'})}
        if (this.state.fields.common.newPassword  && this.state.fields.common.newPasswordRepeat && this.state.fields.common.newPassword !== this.state.fields.common.newPasswordRepeat) {
            errors.push({code:'CHANGE_PASS_ERROR',message:'Введённые новые пароли не совпадают'});
        }
        if (errors.length > 0) {
            this.setState({errors: errors});
        } else {
            let params = this.state.fields;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHANGE_PASSWORD_CONTEXT,'',params,cookie.load('sessionId'));
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Вы сменили пароль, необходимо заново войти в систему под новым паролем'}]});
            }
        }
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    render() {
        const { redirectToLoginPage } = this.state;

        if (redirectToLoginPage) {
            return <Redirect to='/front'/>;
        }

        return (
            <CommonModal title={'Смена пароля'} visible={this.props.visible} style={{width:'540px'}} closeAction={() => this.closeModal()}>
                <div>
                    <form className="form-horizontal">
                        <Field labelWidth='220px' fieldWidth='300px' label='Введите старый пароль' type={Const.PASSWORD} value={this.state.fields.common.oldPassword} onChange={(event) => this.handleChange(event.target.value,'oldPassword','common')} maxLength={20}/>
                        <Field labelWidth='220px' fieldWidth='300px' label='Введите новый пароль' type={Const.PASSWORD} value={this.state.fields.common.newPassword} onChange={(event) => this.handleChange(event.target.value,'newPassword','common')} maxLength={20}/>
                        <Field labelWidth='220px' fieldWidth='300px' label='Повторите новый пароль' type={Const.PASSWORD} value={this.state.fields.common.newPasswordRepeat} onChange={(event) => this.handleChange(event.target.value,'newPasswordRepeat','common')} maxLength={20}/>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <Button value="Ок" onClick={() => this.changePassword()}/>
                            <Button value="Отмена" onClick={() => this.closeModal()}/>
                        </div>
                    </form>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages}
                           closeAction={() => this.setState({successInfoMessages:[],redirectToLoginPage:true})}/>
            </CommonModal>
        )
    }
}

export default ChangePasswordModal;