import React, {Component} from "react";
import * as Const from '../../../Const';
import CommonDbGrid from '../../baseComponent/grid/CommonDbGrid';
import RepairAppEditForm from './RepairAppEditForm'
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import OkCancelDialog from "../../baseComponent/modal/OkCancelDialog";
import InfoModal from "../../baseComponent/modal/InfoModal";

import entityCreatePng from "../../../media/common/action/entityCreate.png";
import entityEditPng from "../../../media/common/action/entityEdit.png";
import entityDeletePng from "../../../media/common/action/entityDelete.png";
import entityViewPng from "../../../media/common/action/entityView.png";
import entityRefreshPng from "../../../media/common/action/entityRefresh.png";
import ActionBar from "../../baseComponent/field/action/ActionBar";
import Action from "../../baseComponent/field/action/Action";
import ActionWithDropdown from "../../baseComponent/field/action/ActionWithDropdown";
import SubAction from "../../baseComponent/field/action/SubAction";

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
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_DELETE,params);
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
            const userRole = CommonUtils.getFormLocalStorage('userRole');
            if (userRole !== Const.CLIENT_ROLE) {
                return (
                    <div className="form-group" style={{marginLeft:'10px', marginBottom:'0px'}}>
                        <ActionBar>
                            <ActionWithDropdown onClick={comp.addEntity} title={'Создать'}  alt={'Создать'} src={entityCreatePng}>
                                <SubAction onClick={comp.addEntity} text={'Открыть в новом окне'}/>
                                <SubAction onClick={null} text={'Открыть форму справа'}/>
                            </ActionWithDropdown>
                            <Action onClick={comp.editEntity} title={'Редактировать'}  alt={'Редактировать'} src={entityEditPng}/>
                            <Action onClick={comp.deleteEntity} title={'Удалить'}  alt={'Удалить'} src={entityDeletePng}/>
                            <Action onClick={comp.viewEntity} title={'Просмотр'}  alt={'Просмотр'} src={entityViewPng}/>
                            <Action onClick={comp.refreshList} title={'Обновить'}  alt={'Обновить'} src={entityRefreshPng}/>
                        </ActionBar>
                    </div>
                );
            } else {
                return(
                    <div className="form-group" style={{marginLeft:'10px', marginBottom:'0px'}}>
                        <ActionBar>
                            <Action onClick={comp.viewEntity} title={'Просмотр'}  alt={'Просмотр'} src={entityViewPng}/>
                            <Action onClick={comp.refreshList} title={'Обновить'}  alt={'Обновить'} src={entityRefreshPng}/>
                        </ActionBar>
                    </div>
                )
            }
        }

        return(
            <div>
                {addActions(this)}
                <CommonDbGrid mainPageComp={this.props.mainPageComp} selectAction={this.changeGridSelection.bind(this)} ref={'ULRepairAppGrid'} dataEntityContext={Const.REPAIR_APP_FORM_CONTEXT} pageSize={10}/>
                <RepairAppEditForm mainPageComp={this.props.mainPageComp} disabled={this.state.editFormDisabled} entityId={this.state.selectedEntityId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedEntityId:''});this.refreshList()}}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
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