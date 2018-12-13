import React, {Component} from "react";
import CommonDbGrid from '../grid/CommonDbGrid';
import * as Const from '../../Const';
import entityAdd from '../../media/entity/entityAdd.png';
import entityEdit from '../../media/entity/entityEdit.png';
import entityDelete from '../../media/entity/entityDelete.png';
import entityRefresh from '../../media/entity/entityRefresh.png';
import * as CommonUtils from "../../utils/CommonUtils";
import ErrorModal from '../../components/modal/ErrorModal';
import UserEditForm from './UserEditForm';
import UniversalField from './../field/UniversalField'
import Button from './../field/Button'
import { Panel } from 'react-bootstrap';
import DictionaryField from './../field/DictionaryField'
import collapseIcon from '../../media/data/collapse.png'
import expandIcon from '../../media/data/expand.png'
import OkCancelDialog from '../../components/modal/OkCancelDialog';
import cookie from 'react-cookies';
import MultiPopup from "../modal/MultiPopup";

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            editFormVisible: false,
            selectedUserId: '',
            filterOpen:true,
            deleteEntityDialogVisible:false,
            filter: {
                ULFilter_login_like:'',
                ULFilter_fio_like:'',
                ULFilter_email_like:'',
                ULFilter_phone_like:'',
                ULFilter_userRole_eq:''
            }
        };

        this.addUserEntity = this.addUserEntity.bind(this);
        this.editUserEntity = this.editUserEntity.bind(this);
        this.deleteUserEntity = this.deleteUserEntity.bind(this);
        this.deleteUserEntityConfirm = this.deleteUserEntityConfirm.bind(this);
        this.refreshUserList = this.refreshUserList.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        this.setState({selectedUserId:''})
    }

    changeGridSelection(selectedUser) {
        this.setState({
            selectedUserId: selectedUser.entityId
        });
    }

    handleChange(event, field) {
        if (field !== null && field !== undefined) {
            this.setState({filter:{...this.state.filter,[field]: event}});
        } else {
            const value = event.target.value;
            const id = event.target.id;
            this.setState({filter:{...this.state.filter,[id]: value}});
        }
    }

    onToggleFilter() {

    }

    toggleFilter() {
        let toggleFilter = !this.state.filterOpen
        this.setState({
            filterOpen: toggleFilter
        });
    }

    chooseUserRoleForFilter(selectedRole){
        this.setState({
            filter:
                {...this.state.filter,
                    ULFilter_userRole_eq: selectedRole.name
                }
        });
    }

    render() {
        return(
            <div id='ULMainDiv'>
                <div id='ULToolbarDiv' style={{marginLeft:'10px'}}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'5px',textAlign:'-webkit-center'}}>
                                        <img onClick={this.addUserEntity}
                                             title={'Создать'}
                                             alt='Создать'
                                             src={entityAdd}
                                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                    </div>
                                </td>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'5px',textAlign:'-webkit-center'}}>
                                        <img onClick={this.editUserEntity}
                                             title={'Редактировать'}
                                             alt='Редактировать'
                                             src={entityEdit}
                                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                    </div>
                                </td>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'5px',textAlign:'-webkit-center'}}>
                                        <img onClick={this.deleteUserEntity}
                                             title={'Удалить'}
                                             alt='Удалить'
                                             src={entityDelete}
                                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                    </div>
                                </td>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'5px',textAlign:'-webkit-center'}}>
                                        <img onClick={this.refreshUserList}
                                             title={'Обновить'}
                                             alt='Обновить'
                                             src={entityRefresh}
                                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Panel style={{marginBottom:'0px'}} id="collapsible-panel-example-3" expanded={this.state.filterOpen} onToggle={this.onToggleFilter}>
                        <Panel.Heading>
                            <div style={{fontWeight:'700'}}>
                                <img onClick={() => this.toggleFilter()} alt='' align={'left'} src={this.state.filterOpen ? collapseIcon : expandIcon} style={{marginTop:'-2px',marginRight:'10px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                Фильтр
                            </div>
                        </Panel.Heading>
                        <Panel.Collapse>
                            <Panel.Body>
                                <form id='ULFilterDiv' className="form-horizontal" style={{paddingTop:'10px'}}>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <UniversalField labelWidth='110px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} id='ULFilter_login_like' value={this.state.filter.ULFilter_login_like} onChange={this.handleChange} maxLength={255}/>
                                            </td>
                                            <td>
                                                <UniversalField labelWidth='110px' fieldWidth='300px' label='ФИО' type={Const.TEXTFIELD} id='ULFilter_fio_like' value={this.state.filter.ULFilter_fio_like} onChange={this.handleChange} maxLength={255}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <UniversalField labelWidth='110px' fieldWidth='300px' label='Email' type={Const.TEXTFIELD} id='ULFilter_email_like' value={this.state.filter.ULFilter_email_like} onChange={this.handleChange} maxLength={255}/>

                                            </td>
                                            <td>
                                                <UniversalField labelWidth='110px' fieldWidth='300px' label='Телефон' type={Const.TEXTFIELD} id='ULFilter_phone_like' value={this.state.filter.ULFilter_phone_like} onChange={this.handleChange} maxLength={255}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <DictionaryField labelWidth='110px'
                                                                 fieldWidth='300px'
                                                                 label='Роль'
                                                                 type={Const.TEXTFIELD}
                                                                 id='ULFilter_userRole_eq'
                                                                 value={this.state.filter.ULFilter_userRole_eq}
                                                                 placeholder=''
                                                                 maxLength={100}
                                                                 context={Const.USER_ROLE_CONTEXT}
                                                                 chooseDictAction={this.chooseUserRoleForFilter.bind(this)}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className="form-group" style={{marginBottom:'0px'}}>
                                        <label style={{width:'100px'}} className="control-label col-sm-2"></label>
                                        <Button style={{marginLeft:'5px'}} id="ULFilterApplyButton" value="Применить" onClick={this.refreshUserList}/>
                                        <Button style={{marginLeft:'5px'}} id="ULFilterClearButton" value="Очистить" onClick={null}/>
                                    </div>
                                </form>
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                </div>
                <CommonDbGrid filter={this.state.filter} selectAction={this.changeGridSelection.bind(this)} ref={'ULUserGrid'} dataEntityContext={Const.USER_CONTEXT} pageSize={10}/>
                <UserEditForm entityId={this.state.selectedUserId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedUserId:''});this.refreshUserList()}}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <OkCancelDialog okCancelVisible={this.state.deleteEntityDialogVisible}
                                question={'Вы действительно хотите удалить выбранную запись?'}
                                cancelAction={() => this.setState({deleteEntityDialogVisible:false})}
                                okAction={this.deleteUserEntityConfirm.bind(this)}/>
                <MultiPopup popupData={this.state.successInfoMessages} popupType={Const.INFO_POPUP} closeAction={() => this.setState({successInfoMessages:[]})}/>
            </div>
        )
    }

}

export default UserList;