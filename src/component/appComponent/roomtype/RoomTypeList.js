import React, {Component} from "react";
import CommonDbGrid from '../../baseComponent/grid/CommonDbGrid';
import * as Const from '../../../Const';

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
                <CommonDbGrid selectAction={null} dataEntityContext={Const.ROOM_TYPE_CONTEXT} pageSize={10}/>
            </div>
        )
    }

}

export default RoomTypeList;