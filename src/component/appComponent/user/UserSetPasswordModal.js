import {Component} from "react";
import CommonModal from "../../baseComponent/modal/CommonModal";
import React from "react";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import InfoModal from "../../baseComponent/modal/InfoModal";
import * as Const from "../../../Const";
import Button from "../../baseComponent/field/Button";
import * as CommonUtils from "../../../utils/CommonUtils";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import Label from "../../baseComponent/field/Label";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import TextField from "../../baseComponent/field/TextField";

let fieldsObject = {
    userId:'',
    userLogin:'',
    newPassword:''
};

class UserSetPasswordModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            successInfoMessages: [],
            closeAction:props.closeAction,
            fields:fieldsObject
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setNewPassword = this.setNewPassword.bind(this);
        this.closeAction = props.closeAction;
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.setState({
                fields:{
                    ...this.state.fields,
                    userId:this.props.userId,
                    userLogin:this.props.userLogin
                }
            });
        }
    }

    closeModal() {
        this.setState({
            errors: [],
            successInfoMessages: [],
            fields:fieldsObject
        });
        this.closeAction()
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    async setNewPassword(evt) {
        let params = this.state.fields;
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.AUTH,Const.AUTH_SET_NEW_PASSWORD,params);
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({successInfoMessages: [{code:'INFO',message:'Для пользователя '+ params.userLogin + ' задан новый пароль: ' + params.newPassword}]});
        }
    }

    render() {
        return (
            <CommonModal title={'Задать пользователю новый пароль'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Введите новый пароль'} width={'180px'}/>
                        <TextField width={'250px'} value={this.state.fields.newPassword} onChange={(event) => this.handleChange(event.target.value,'newPassword','')}/>
                    </HorizontalPanel>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.setNewPassword()}/>
                        <Button value="Отмена" onClick={() => this.closeModal()}/>
                    </div>
                </VerticalPanel>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages:[]}); this.closeModal()}}/>
            </CommonModal>
        )
    }

}

export default UserSetPasswordModal;