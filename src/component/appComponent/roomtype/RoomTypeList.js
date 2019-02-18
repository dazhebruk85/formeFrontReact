import React, {Component} from "react";
import CommonDbGrid from '../../baseComponent/grid/CommonDbGrid';
import * as Const from '../../../Const';
import CommonModal from "../../baseComponent/modal/CommonModal";

class RoomTypeList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        };
    }

    render() {
        return(
            <div>
                <CommonDbGrid mainPageComp={this.props.mainPageComp} selectAction={null} dataEntityContext={Const.ROOM_TYPE_CONTEXT} pageSize={10}/>
            </div>
        )
    }

}

export default RoomTypeList;