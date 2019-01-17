import React, {Component} from "react";
import * as Const from '../../../Const';
import CommonDbGrid from '../../baseComponent/grid/CommonDbGrid';
import Button from './../../baseComponent/field/Button'
import RepairAppEditForm from './RepairAppEditForm'
import * as CommonUtils from "../../../utils/CommonUtils";
import cookie from "react-cookies";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import OkCancelDialog from "../../baseComponent/modal/OkCancelDialog";
import InfoModal from "../../baseComponent/modal/InfoModal";

class RepairAppList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedRepairAppId: '',
            editFormVisible:false,
            deleteEntityDialogVisible:false
        };

        this.addRepairAppEntity = this.addRepairAppEntity.bind(this);
        this.editRepairAppEntity = this.editRepairAppEntity.bind(this);
        this.refreshRepairAppList = this.refreshRepairAppList.bind(this);
        this.deleteRepairAppEntity = this.deleteRepairAppEntity.bind(this);
        this.deleteRepairEntityConfirm = this.deleteRepairEntityConfirm.bind(this);
    }

    changeGridSelection(selectedRepairAppId) {
        this.setState({
            selectedRepairAppId: selectedRepairAppId.entityId
        });
    }

    addRepairAppEntity() {
        this.setState({selectedRepairAppId:''});
        setTimeout(() => this.setState({editFormVisible:true}), 0);
    }

    editRepairAppEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedRepairAppId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({
                editFormVisible: true
            });
        }
    }

    refreshRepairAppList() {
        this.refs.ULRepairAppGrid.getGridListData();
        this.setState({selectedRepairAppId:''})
    }

    deleteRepairAppEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedRepairAppId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({deleteEntityDialogVisible:true});
        }
    }

    async deleteRepairEntityConfirm() {
        let params = {entityId: this.state.selectedRepairAppId};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_DELETE,params,cookie.load('sessionId'));
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                successInfoMessages: [{code:'INFO',message:'Анкета удалена'}],
                deleteEntityDialogVisible:false
            });
            this.refreshRepairAppList();
        }
    }

    render() {
        return(
            <div>
                <div className="form-group" style={{marginLeft:'5px', marginBottom:'0px'}}>
                    <Button style={{marginLeft:'5px'}} value="Создать" onClick={this.addRepairAppEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Редактировать" onClick={this.editRepairAppEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Удалить" onClick={this.deleteRepairAppEntity}/>
                </div>
                <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'ULRepairAppGrid'} dataEntityContext={Const.REPAIR_APP_FORM_CONTEXT} pageSize={10}/>
                <RepairAppEditForm entityId={this.state.selectedRepairAppId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedRepairAppId:''});this.refreshRepairAppList()}}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <OkCancelDialog okCancelVisible={this.state.deleteEntityDialogVisible}
                                question={'Вы действительно хотите удалить выбранную запись?'}
                                cancelAction={() => this.setState({deleteEntityDialogVisible:false})}
                                okAction={this.deleteRepairEntityConfirm.bind(this)}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => this.setState({successInfoMessages:[]})}/>
            </div>
        )
    }
}

export default RepairAppList;