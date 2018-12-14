import React, {Component} from "react";
import * as Const from '../../Const';
import CommonDbGrid from '../grid/CommonDbGrid';

class RepairAppList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedRepairAppFormId: '',
        };
    }

    changeGridSelection(selectedRepairAppFormId) {
        this.setState({
            selectedRepairAppFormId: selectedRepairAppFormId.entityId
        });
    }

    render() {
        return(
            <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'ULRepairAppFormGrid'} dataEntityContext={Const.REPAIR_APP_FORM_CONTEXT} pageSize={10}/>
        )
    }
}

export default RepairAppList;