import {Component} from "react";
import CommonDbGrid from "../../baseComponent/grid/CommonDbGrid";
import * as Const from "../../../Const";
import React from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import ConfigParamEditForm from "./ConfigParamEditForm";

import entityEditPng from "../../../media/common/action/entityEdit.png";
import entityRefreshPng from "../../../media/common/action/entityRefresh.png";
import Action from "../../baseComponent/action/Action";
import ActionBar from "../../baseComponent/action/ActionBar";

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
            selectedEntityId:selectedEntity.id
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
                <div style={{margin:'5px 5px 0px 5px'}}>
                    <ActionBar>
                        <Action onClick={this.editEntity} title={'Редактировать'}  alt={'Редактировать'} src={entityEditPng}/>
                        <Action onClick={this.refreshList} title={'Обновить'}  alt={'Обновить'} src={entityRefreshPng}/>
                    </ActionBar>
                </div>
                <CommonDbGrid mainPageComp={this.props.mainPageComp} entityId={this.state.selectedEntityId} ref={'CPLConfigParamGrid'} selectAction={this.changeGridSelection.bind(this)} context={Const.CONFIG_PARAM}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <ConfigParamEditForm mainPageComp={this.props.mainPageComp} entityId={this.state.selectedEntityId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedEntityId:''});this.refreshList()}}/>
            </div>
        )
    }

}

export default ConfigParamList