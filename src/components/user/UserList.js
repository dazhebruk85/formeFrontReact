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

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            editFormVisible: false,
            selectedUserId: null,
            filter: {}
        };

        this.addUserEntity = this.addUserEntity.bind(this);
        this.editUserEntity = this.editUserEntity.bind(this);
        this.deleteUserEntity = this.deleteUserEntity.bind(this);
        this.refreshUserList = this.refreshUserList.bind(this);
    }

    addUserEntity() {
        this.setState({selectedUserId:null});
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
            let aaa = 0;
        }
    }

    refreshUserList() {
        this.refs.ULUserGrid.getGridListData()
        this.setState({selectedUserId:null})
    }

    changeGridSelection(selectedUser) {
        this.setState({
            selectedUserId: selectedUser.entityId
        });
    }

    render() {
        return(
            <div id='ULMainDiv'>
                <div id='ULToolbarDiv' style={{marginLeft:'25px'}}>
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
                </div>
                <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'ULUserGrid'} dataEntityContext={Const.USER_CONTEXT} pageSize={10}/>
                <UserEditForm entityId={this.state.selectedUserId} visible={this.state.editFormVisible} closeAction={() => this.setState({editFormVisible:false,selectedUserId:null})}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }

}

export default UserList;