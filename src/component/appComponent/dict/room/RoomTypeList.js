import React, {Component} from "react";
import CommonDbGrid from '../../../baseComponent/grid/CommonDbGrid';
import * as Const from '../../../../Const';

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
                <CommonDbGrid mainPageComp={this.props.mainPageComp} selectAction={null} context={Const.ROOM_TYPE}/>
            </div>
        )
    }

}

export default RoomTypeList;