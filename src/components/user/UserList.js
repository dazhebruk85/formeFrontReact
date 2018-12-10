import React, {Component} from "react";
import CommonDbGrid from '../grid/CommonDbGrid';
import * as Const from '../../Const';
import entityAdd from '../../media/entity/entityAdd.png';
import entityEdit from '../../media/entity/entityEdit.png';
import entityDelete from '../../media/entity/entityDelete.png';
import * as CommonUtils from "../../utils/CommonUtils";
import ErrorModal from '../../components/modal/ErrorModal';

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            filter: {}
        };

        this.addUserEntity = this.addUserEntity.bind(this);
        this.editUserEntity = this.editUserEntity.bind(this);
        this.deleteUserEntity = this.deleteUserEntity.bind(this);
    }

    addUserEntity() {
        let aaa=0;
    }

    editUserEntity() {
        let selectedUser = this.refs.ULUserGrid.state.selectedItem
        if (CommonUtils.objectIsEmpty(selectedUser)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            let aaa = 0;
        }
    }

    deleteUserEntity() {
        let selectedUser = this.refs.ULUserGrid.state.selectedItem
        if (CommonUtils.objectIsEmpty(selectedUser)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            let aaa = 0;
        }
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
                            </tr>
                        </tbody>
                    </table>
                </div>
                <CommonDbGrid ref={'ULUserGrid'} dataEntityContext={Const.USER_CONTEXT} pageSize={10}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }

}

export default UserList;