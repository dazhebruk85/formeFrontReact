import React, {Component} from "react";
import * as Const from '../../Const';
import CommonDbGrid from '../grid/CommonDbGrid';
import Button from './../field/Button'

class RepairAppList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedRepairAppId: '',
        };
    }

    changeGridSelection(selectedRepairAppId) {
        this.setState({
            selectedRepairAppId: selectedRepairAppId.entityId
        });
    }

    render() {
        return(
            <div>
                <div className="form-group" style={{marginLeft:'5px', marginBottom:'0px'}}>
                    <Button style={{marginLeft:'5px'}} value="Создать" onClick={null}/>
                    <Button style={{marginLeft:'5px'}} value="Редактировать" onClick={null}/>
                    <Button style={{marginLeft:'5px'}} value="Удалить" onClick={null}/>
                </div>
                <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'ULRepairAppGrid'} dataEntityContext={Const.REPAIR_APP_FORM_CONTEXT} pageSize={10}/>
            </div>
        )
    }
}

export default RepairAppList;