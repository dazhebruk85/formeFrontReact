import React, {Component} from "react";
import * as Const from '../../../Const';
import CommonDbGrid from '../../baseComponent/grid/CommonDbGrid';
import Button from './../../baseComponent/field/Button'
import RepairAppEditForm from './RepairAppEditForm'

class RepairAppList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedRepairAppId: '',
            editFormVisible:false
        };

        this.addRepairAppEntity = this.addRepairAppEntity.bind(this);
        this.refreshRepairAppList = this.refreshRepairAppList.bind(this);
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

    refreshRepairAppList() {
        this.refs.ULRepairAppGrid.getGridListData();
        this.setState({selectedRepairAppId:''})
    }

    render() {
        return(
            <div>
                <div className="form-group" style={{marginLeft:'5px', marginBottom:'0px'}}>
                    <Button style={{marginLeft:'5px'}} value="Создать" onClick={this.addRepairAppEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Редактировать" onClick={null}/>
                    <Button style={{marginLeft:'5px'}} value="Удалить" onClick={null}/>
                </div>
                <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'ULRepairAppGrid'} dataEntityContext={Const.REPAIR_APP_FORM_CONTEXT} pageSize={10}/>
                <RepairAppEditForm entityId={this.state.selectedRepairAppId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedRepairAppId:''});this.refreshRepairAppList()}}/>
            </div>
        )
    }
}

export default RepairAppList;