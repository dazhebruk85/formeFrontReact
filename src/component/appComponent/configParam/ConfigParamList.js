import {Component} from "react";
import CommonDbGrid from "../../baseComponent/grid/CommonDbGrid";
import * as Const from "../../../Const";
import React from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import ConfigParamEditForm from "./ConfigParamEditForm";

import '../../../media/common/action/entityAction.css';
import entityEditPng from "../../../media/common/action/entityEdit.png";
import entityRefreshPng from "../../../media/common/action/entityRefresh.png";

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
                <div className="form-group" style={{marginLeft:'10px', marginBottom:'0px'}}>
                    <table>
                        <tbody>
                        <tr>
                            <td className={'entityActionTd'}>
                                <div className={'entityActionDiv'}>
                                    <img onClick={this.editEntity} title={'Редактировать'}  alt={'Редактировать'} src={entityEditPng} className={'entityActionImg'}/>
                                </div>
                            </td>
                            <td className={'entityActionTd'}>
                                <div className={'entityActionDiv'}>
                                    <img onClick={this.refreshList} title={'Обновить'}  alt={'Обновить'} src={entityRefreshPng} className={'entityActionImg'}/>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <CommonDbGrid mainPageComp={this.props.mainPageComp} entityId={this.state.selectedEntityId} ref={'CPLConfigParamGrid'} selectAction={this.changeGridSelection.bind(this)} dataEntityContext={Const.CONFIG_PARAM_CONTEXT} pageSize={10}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <ConfigParamEditForm mainPageComp={this.props.mainPageComp} entityId={this.state.selectedEntityId} visible={this.state.editFormVisible} closeAction={() => {this.setState({editFormVisible:false,selectedEntityId:''});this.refreshList()}}/>
            </div>
        )
    }

}

export default ConfigParamList