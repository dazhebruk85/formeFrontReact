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
import InfoModal from "../../baseComponent/modal/InfoModal";
import CollapsePanel from './../../baseComponent/panel/CollapsePanel'
import UserSetPasswordModal from "./UserSetPasswordModal";

import entityEditPng from "../../../media/common/action/entityEdit.png";
import entityRefreshPng from "../../../media/common/action/entityRefresh.png";
import entityCreatePng from "../../../media/common/action/entityCreate.png";
import entityDeletePng from "../../../media/common/action/entityDelete.png";
import setPasswordPng from "../../../media/common/action/setPassword.png";
import Action from "../../baseComponent/action/Action";
import ActionBar from "../../baseComponent/action/ActionBar";

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            editFormVisible: false,
            selectedEntityId: '',
            selectedUserLogin: '',
            deleteEntityDialogVisible:false,
            setNewPasswordModalVisible: false,
            fields:{
                filter: {
                    ULFilter_main_login_like:'',
                    ULFilter_main_fio_like:'',
                    ULFilter_main_email_like:'',
                    ULFilter_main_phone_like:'',
                    ULFilter_userRole_name_eq:''
                }
            }
        };

        this.addEntity = this.addEntity.bind(this);
        this.editEntity = this.editEntity.bind(this);
        this.deleteEntity = this.deleteEntity.bind(this);
        this.deleteEntityConfirm = this.deleteEntityConfirm.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showSetNewPasswordModal = this.showSetNewPasswordModal.bind(this);
        this.closeSetNewPasswordModal = this.closeSetNewPasswordModal.bind(this);
    }

    showSetNewPasswordModal(evt) {
        if (CommonUtils.objectIsEmpty(this.state.selectedEntityId)) {
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

    addEntity() {
        this.setState({selectedEntityId:''});
        setTimeout(() => this.setState({editFormVisible:true}), 0);
    }

    editEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedEntityId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({
                editFormVisible: true
            });
        }
    }

    deleteEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedEntityId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({deleteEntityDialogVisible:true});
        }
    }

    async deleteEntityConfirm() {
        let params = {entityId: this.state.selectedEntityId};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_DELETE,params);
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                successInfoMessages: [{code:'INFO',message:'Пользователь удален'}],
                deleteEntityDialogVisible:false
            });
            this.refreshList();
        }
    }

    refreshList() {
        this.refs.ULUserGrid.getGridListData();
        this.setState({
            selectedEntityId:'',
            selectedUserLogin:''
        })
    }

    changeGridSelection(selectedEntity) {
        this.setState({
            selectedEntityId:selectedEntity.entityId,
            selectedUserLogin:selectedEntity.login,
        });
    }

    chooseUserRoleForFilter(selectedRole){
        this.setState({
            fields:{
                ...this.state.fields,
                filter:{
                    ...this.state.filter,
                    ULFilter_userRole_name_eq: selectedRole ? selectedRole.name : ''
                }
            }
        });
    }

    clearFilter() {
        this.setState({
            fields:{
                ...this.state.fields,
                filter:{
                    ...this.state.filter,
                    ULFilter_main_login_like:'',
                    ULFilter_main_fio_like:'',
                    ULFilter_main_email_like:'',
                    ULFilter_main_phone_like:'',
                    ULFilter_userRole_name_eq:''
                }
            }
        });
        setTimeout(() => this.refreshList(), 0);
    }

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    render() {
        return(
            <div>
                <div className="form-group" style={{marginLeft:'10px', marginBottom:'10px'}}>
                    <ActionBar>
                        <Action onClick={this.addEntity} title={'Создать'}  alt={'Создать'} src={entityCreatePng}/>
                        <Action onClick={this.editEntity} title={'Редактировать'}  alt={'Редактировать'} src={entityEditPng}/>
                        <Action onClick={this.deleteEntity} title={'Удалить'}  alt={'Удалить'} src={entityDeletePng}/>
                        <Action onClick={this.refreshList} title={'Обновить'}  alt={'Обновить'} src={entityRefreshPng}/>
                        <Action onClick={this.showSetNewPasswordModal} title={'Задать пароль'}  alt={'Задать пароль'} src={setPasswordPng}/>
                    </ActionBar>
                </div>

                <div style={{marginLeft:'10px'}}>
                    <CollapsePanel title={'Фильтр'}>
                        <form className="form-horizontal" style={{paddingTop:'10px'}}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} value={this.state.fields.filter.ULFilter_main_login_like} onChange={(event) => this.handleChange(event.target.value,'ULFilter_main_login_like','filter')} maxLength={255}/>
                                    </td>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='ФИО' type={Const.TEXTFIELD} value={this.state.fields.filter.ULFilter_main_fio_like} onChange={(event) => this.handleChange(event.target.value,'ULFilter_main_fio_like','filter')} maxLength={255}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='Email' type={Const.TEXTFIELD} value={this.state.fields.filter.ULFilter_main_email_like} onChange={(event) => this.handleChange(event.target.value,'ULFilter_main_email_like','filter')} maxLength={255}/>

                                    </td>
                                    <td>
                                        <Field labelWidth='110px' fieldWidth='300px' label='Телефон' type={Const.TEXTFIELD} value={this.state.fields.filter.ULFilter_main_phone_like} onChange={(event) => this.handleChange(event.target.value,'ULFilter_main_phone_like','filter')} maxLength={255}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <DictField labelWidth='110px'
                                                   fieldWidth='300px'
                                                   label='Роль'
                                                   type={Const.TEXTFIELD}
                                                   value={this.state.fields.filter.ULFilter_userRole_name_eq}
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
                                <Button style={{marginLeft:'5px'}} value="Применить" onClick={this.refreshList}/>
                                <Button style={{marginLeft:'5px'}} value="Очистить" onClick={this.clearFilter}/>
                            </div>
                        </form>
                    </CollapsePanel>
                </div>
                <CommonDbGrid mainPageComp={this.props.mainPageComp} filter={this.state.fields.filter} selectAction={this.changeGridSelection.bind(this)} ref={'ULUserGrid'} dataEntityContext={Const.USER_CONTEXT} pageSize={10}/>
                <UserEditForm mainPageComp={this.props.mainPageComp} entityId={this.state.selectedEntityId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedEntityId:''});this.refreshList()}}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <OkCancelDialog okCancelVisible={this.state.deleteEntityDialogVisible}
                                cancelAction={() => this.setState({deleteEntityDialogVisible:false})}
                                okAction={this.deleteEntityConfirm.bind(this)}>
                    <div>Вы действительно хотите удалить выбранную запись?</div>
                </OkCancelDialog>
                <UserSetPasswordModal mainPageComp={this.props.mainPageComp} userId={this.state.selectedEntityId} userLogin={this.state.selectedUserLogin} visible={this.state.setNewPasswordModalVisible} closeAction={() => {this.closeSetNewPasswordModal(); this.refreshList()}}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => this.setState({successInfoMessages:[]})}/>
            </div>
        )
    }

}

export default UserList;