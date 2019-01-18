import React, {Component} from "react";
import CommonDbGrid from '../../baseComponent/grid/CommonDbGrid';
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import UserEditForm from './UserEditForm';
import Field from '../../baseComponent/field/Field'
import Button from './../../baseComponent/field/Button'
import DictField from '../../baseComponent/field/DictField'
import OkCancelDialog from '../../../component/baseComponent/modal/OkCancelDialog';
import cookie from 'react-cookies';
import InfoModal from "../../baseComponent/modal/InfoModal";
import CollapsePanel from './../../baseComponent/panel/CollapsePanel'
import UserSetPasswordModal from "./UserSetPasswordModal";

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            editFormVisible: false,
            selectedUserId: '',
            selectedUserLogin: '',
            deleteEntityDialogVisible:false,
            setNewPasswordModalVisible: false,
            filter: {
                ULFilter_main_login_like:'',
                ULFilter_main_fio_like:'',
                ULFilter_main_email_like:'',
                ULFilter_main_phone_like:'',
                ULFilter_userRole_name_eq:''
            }
        };

        this.addUserEntity = this.addUserEntity.bind(this);
        this.editUserEntity = this.editUserEntity.bind(this);
        this.deleteUserEntity = this.deleteUserEntity.bind(this);
        this.deleteUserEntityConfirm = this.deleteUserEntityConfirm.bind(this);
        this.refreshUserList = this.refreshUserList.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showSetNewPasswordModal = this.showSetNewPasswordModal.bind(this);
        this.closeSetNewPasswordModal = this.closeSetNewPasswordModal.bind(this);
    }

    showSetNewPasswordModal(evt) {
        if (CommonUtils.objectIsEmpty(this.state.selectedUserId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({setNewPasswordModalVisible: true})
        }
    }

    closeSetNewPasswordModal(evt) {
        this.setState({
            setNewPasswordModalVisible: false
        })
    }

    addUserEntity() {
        this.setState({selectedUserId:''});
        setTimeout(() => this.setState({editFormVisible:true}), 0);
    }

    editUserEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedUserId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({
                editFormVisible: true
            });
        }
    }

    deleteUserEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedUserId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({deleteEntityDialogVisible:true});
        }
    }

    async deleteUserEntityConfirm() {
        let params = {entityId: this.state.selectedUserId};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_DELETE,params,cookie.load('sessionId'));
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                successInfoMessages: [{code:'INFO',message:'Пользователь удален'}],
                deleteEntityDialogVisible:false
            });
            this.refreshUserList();
        }
    }

    refreshUserList() {
        this.refs.ULUserGrid.getGridListData();
        this.setState({selectedUserId:'',selectedUserLogin:''})
    }

    changeGridSelection(selectedUser) {
        this.setState({
            selectedUserId: selectedUser.entityId,
            selectedUserLogin: selectedUser.login,
        });
    }

    chooseUserRoleForFilter(selectedRole){
        this.setState({
            filter:
                {...this.state.filter,
                    ULFilter_userRole_name_eq: selectedRole ? selectedRole.name : ''
                }
        });
    }

    clearFilter() {
        this.setState({
            filter:
                {...this.state.filter,
                    ULFilter_main_login_like:'',
                    ULFilter_main_fio_like:'',
                    ULFilter_main_email_like:'',
                    ULFilter_main_phone_like:'',
                    ULFilter_userRole_name_eq:''
                }
        });
        setTimeout(() => this.refreshUserList(), 0);
    }

    handleChange(event, fieldName) {
        if (event instanceof Date) {
            this.setState({
                filter: {
                    ...this.state.filter,
                    [fieldName]: event
                }
            });
        } else {
            const value = event.target.value;
            this.setState({
                filter: {
                    ...this.state.filter,
                    [fieldName]: value
                }
            });
        }
    }

    render() {
        return(
            <div>
                <div className="form-group" style={{marginLeft:'5px', marginBottom:'10px'}}>
                    <Button style={{marginLeft:'5px'}} value="Создать" onClick={this.addUserEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Редактировать" onClick={this.editUserEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Удалить" onClick={this.deleteUserEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Обновить" onClick={this.refreshUserList}/>
                    <Button style={{marginLeft:'5px'}} value="Задать пароль" onClick={this.showSetNewPasswordModal}/>
                </div>
                <div style={{marginLeft:'10px'}}>
                    <CollapsePanel title={'Фильтр'}>
                        <form className="form-horizontal" style={{paddingTop:'10px'}}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} value={this.state.filter.ULFilter_main_login_like} onChange={(event) => this.handleChange(event, 'ULFilter_main_login_like')} maxLength={255}/>
                                    </td>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='ФИО' type={Const.TEXTFIELD} value={this.state.filter.ULFilter_main_fio_like} onChange={(event) => this.handleChange(event, 'ULFilter_main_fio_like')} maxLength={255}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='Email' type={Const.TEXTFIELD} value={this.state.filter.ULFilter_main_email_like} onChange={(event) => this.handleChange(event, 'ULFilter_main_email_like')} maxLength={255}/>

                                    </td>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='Телефон' type={Const.TEXTFIELD} value={this.state.filter.ULFilter_main_phone_like} onChange={(event) => this.handleChange(event, 'ULFilter_main_phone_like')} maxLength={255}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <DictField labelWidth='110px'
                                                   fieldWidth='300px'
                                                   label='Роль'
                                                   type={Const.TEXTFIELD}
                                                   value={this.state.filter.ULFilter_userRole_name_eq}
                                                   placeholder=''
                                                   maxLength={100}
                                                   context={Const.USER_ROLE_CONTEXT}
                                                   chooseDictAction={this.chooseUserRoleForFilter.bind(this)}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="form-group" style={{marginBottom:'0px'}}>
                                <label style={{width:'110px'}} className="control-label col-sm-2"></label>
                                <Button style={{marginLeft:'5px'}} value="Применить" onClick={this.refreshUserList}/>
                                <Button style={{marginLeft:'5px'}} value="Очистить" onClick={this.clearFilter}/>
                            </div>
                        </form>
                    </CollapsePanel>
                </div>
                <CommonDbGrid filter={this.state.filter} selectAction={this.changeGridSelection.bind(this)} ref={'ULUserGrid'} dataEntityContext={Const.USER_CONTEXT} pageSize={10}/>
                <UserEditForm entityId={this.state.selectedUserId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedUserId:''});this.refreshUserList()}}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <OkCancelDialog okCancelVisible={this.state.deleteEntityDialogVisible}
                                cancelAction={() => this.setState({deleteEntityDialogVisible:false})}
                                okAction={this.deleteUserEntityConfirm.bind(this)}>
                    <div>Вы действительно хотите удалить выбранную запись?</div>
                </OkCancelDialog>
                <UserSetPasswordModal userId={this.state.selectedUserId} userLogin={this.state.selectedUserLogin} visible={this.state.setNewPasswordModalVisible} closeAction={() => {this.closeSetNewPasswordModal(); this.refreshUserList()}}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => this.setState({successInfoMessages:[]})}/>
            </div>
        )
    }

}

export default UserList;