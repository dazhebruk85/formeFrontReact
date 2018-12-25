import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import cookie from 'react-cookies';
import * as Const from '../../../Const';
import { Redirect } from 'react-router-dom'
import InfoModal from "../../baseComponent/modal/InfoModal";
import UniversalField from './../../baseComponent/field/UniversalField'
import Button from './../../baseComponent/field/Button'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as CommonUtils from "../../../utils/CommonUtils";

class ChangePasswordModal extends Component {

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
            <CommonModal title={'Смена пароля'} visible={this.props.visible} style={{width:'540px'}} closeAction={() => this.closeModal()}>
                <div>
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
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages}
                           closeAction={() => this.setState({successInfoMessages:[],redirectToLoginPage:true})}/>
            </CommonModal>
        )
    }
}

export default ChangePasswordModal;