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

class UserSetPasswordModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            successInfoMessages: [],
            closeAction:props.closeAction,
            fields:{
                common:{
                    userId:'',
                    userLogin:'',
                    newPassword:''
                }
            }
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
                    common:{
                        ...this.state.fields.common,
                        userId:this.props.userId,
                        userLogin:this.props.userLogin
                    }
                }
            });
        }
    }

    closeModal() {
        this.setState({
            errors: [],
            successInfoMessages: [],
            fields:{
                ...this.state.fields,
                common:{
                    ...this.state.fields.common,
                    userId:'',
                    userLogin:'',
                    newPassword:'',
                }
            }
        });
        this.closeAction()
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    async setNewPassword(evt) {
        let errors = [];
        if (!this.state.fields.common.newPassword) {errors.push({code:'SET_NEW_PASS_ERROR',message:'Необходимо ввести новый пароль'})}
        if (errors.length > 0) {
            this.setState({errors: errors});
        } else {
            let params = this.state.fields;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.SET_NEW_PASSWORD_CONTEXT,'',params);
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Для пользователя '+ params.common.userLogin + ' задан новый пароль: ' + params.common.newPassword}]});
            }
        }
    }

    render() {
        return (
            <CommonModal title={'Задать пользователю новый пароль'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Введите новый пароль'} width={'180px'}/>
                        <TextField width={'250px'} value={this.state.fields.common.newPassword} onChange={(event) => this.handleChange(event.target.value,'newPassword','common')}/>
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