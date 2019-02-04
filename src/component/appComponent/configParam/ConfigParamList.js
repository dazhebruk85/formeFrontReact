import {Component} from "react";
import CommonDbGrid from "../../baseComponent/grid/CommonDbGrid";
import * as Const from "../../../Const";
import React from "react";
import Button from "../../baseComponent/field/Button";
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import ConfigParamEditForm from "./ConfigParamEditForm";

class ConfigParamList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedEntityId: '',
            editFormVisible:false,
            filter: {}
        };

        this.editEntity = this.editEntity.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    changeGridSelection(selectedEntity) {
        this.setState({
            selectedEntityId:selectedEntity.entityId
        });
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

    refreshList() {
        this.refs.CPLConfigParamGrid.getGridListData();
        this.setState({selectedEntityId:''})
    }

    render() {
        return(
            <div>
                <div className="form-group" style={{marginLeft:'5px', marginBottom:'0px'}}>
                    <Button style={{marginLeft:'5px'}} value="Редактировать" onClick={this.editEntity}/>
                    <Button style={{marginLeft:'5px'}} value="Обновить" onClick={this.refreshList}/>
                </div>
                <CommonDbGrid entityId={this.state.selectedEntityId} ref={'CPLConfigParamGrid'} selectAction={this.changeGridSelection.bind(this)} dataEntityContext={Const.CONFIG_PARAM_CONTEXT} pageSize={10}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <ConfigParamEditForm entityId={this.state.selectedEntityId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedEntityId:''});this.refreshList()}}/>
            </div>
        )
    }

}

export default ConfigParamList