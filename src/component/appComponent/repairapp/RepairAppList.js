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
            errors:[],
            selectedEntityId:'',
            editFormVisible:false,
            editFormDisabled:false,
            deleteEntityDialogVisible:false,
            filter:{}
        };

        this.addEntity = this.addEntity.bind(this);
        this.editEntity = this.editEntity.bind(this);
        this.viewEntity = this.viewEntity.bind(this);
        this.deleteEntity = this.deleteEntity.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.deleteEntityConfirm = this.deleteEntityConfirm.bind(this);
    }

    changeGridSelection(selectedEntity) {
        this.setState({
            selectedEntityId: selectedEntity.entityId
        });
    }

    addEntity() {
        this.setState({selectedEntityId:''});
        setTimeout(() => this.setState({
            editFormVisible:true,
            editFormDisabled:false
        }), 0);
    }

    editEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedEntityId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({
                editFormVisible:true,
                editFormDisabled:false
            });
        }
    }

    viewEntity() {
        if (CommonUtils.objectIsEmpty(this.state.selectedEntityId)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.setState({
                editFormVisible:true,
                editFormDisabled:true
            });
        }
    }

    refreshList() {
        this.refs.ULRepairAppGrid.getGridListData();
        this.setState({selectedEntityId:''})
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
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_DELETE,params,cookie.load('sessionId'));
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                successInfoMessages: [{code:'INFO',message:'Анкета удалена'}],
                deleteEntityDialogVisible:false
            });
            this.refreshList();
        }
    }

    render() {
        function addActions(comp) {
            const userRole = cookie.load('userRole');
            if (userRole !== Const.CLIENT_ROLE) {
                return (
                    <div className="form-group" style={{marginLeft:'5px', marginBottom:'0px'}}>
                        <Button style={{marginLeft:'5px'}} value="Создать" onClick={comp.addEntity}/>
                        <Button style={{marginLeft:'5px'}} value="Редактировать" onClick={comp.editEntity}/>
                        <Button style={{marginLeft:'5px'}} value="Удалить" onClick={comp.deleteEntity}/>
                        <Button style={{marginLeft:'5px'}} value="Обновить" onClick={comp.refreshList}/>
                    </div>
                );
            } else {
                return(<div className="form-group" style={{marginLeft:'5px', marginBottom:'0px'}}>
                    <Button style={{marginLeft:'5px'}} value="Просмотр" onClick={comp.viewEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Обновить" onClick={comp.refreshList}/>
                </div>)
            }
        }

        return(
            <div>
                {addActions(this)}
                <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'ULRepairAppGrid'} dataEntityContext={Const.REPAIR_APP_FORM_CONTEXT} pageSize={10}/>
                <RepairAppEditForm disabled={this.state.editFormDisabled} entityId={this.state.selectedEntityId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedEntityId:''});this.refreshList()}}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <OkCancelDialog okCancelVisible={this.state.deleteEntityDialogVisible}
                                cancelAction={() => this.setState({deleteEntityDialogVisible:false})}
                                okAction={this.deleteEntityConfirm.bind(this)}>
                    <div>Вы действительно хотите удалить выбранную запись?</div>
                </OkCancelDialog>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => this.setState({successInfoMessages:[]})}/>
            </div>
        )
    }
}

export default RepairAppList;