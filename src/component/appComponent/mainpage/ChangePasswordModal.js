import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as Const from '../../../Const';
import InfoModal from "../../baseComponent/modal/InfoModal";
import Button from './../../baseComponent/field/Button'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as CommonUtils from "../../../utils/CommonUtils";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import Label from "../../baseComponent/fieldMy/Label";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import PasswordField from "../../baseComponent/fieldMy/PasswordField";

class ChangePasswordModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            successInfoMessages:[],
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
            successInfoMessages: [],
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
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHANGE_PASSWORD_CONTEXT,'',params);
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
        return (
            <CommonModal title={'Смена пароля'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Введите старый пароль'} width={'200px'}/>
                        <PasswordField width={'250px'} value={this.state.fields.common.oldPassword} onChange={(event) => this.handleChange(event.target.value,'oldPassword','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Введите новый пароль'} width={'200px'}/>
                        <PasswordField width={'250px'} value={this.state.fields.common.newPassword} onChange={(event) => this.handleChange(event.target.value,'newPassword','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Повторите новый пароль'} width={'200px'}/>
                        <PasswordField width={'250px'} value={this.state.fields.common.newPasswordRepeat} onChange={(event) => this.handleChange(event.target.value,'newPasswordRepeat','common')}/>
                    </HorizontalPanel>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.changePassword()}/>
                        <Button value="Отмена" onClick={() => this.closeModal()}/>
                    </div>
                </VerticalPanel>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages}
                           closeAction={() => {this.setState({successInfoMessages:[]});this.props.mainPageComp.setState({sessionId:''})}}/>
            </CommonModal>
        )
    }
}

export default ChangePasswordModal;