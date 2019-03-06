import React, {Component} from "react";
import CommonDbGrid from '../../../baseComponent/grid/CommonDbGrid';
import * as Const from '../../../../Const';

export default class RoomExcludeObjectList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        };
    }

    render() {
        return(
            <div>
                <CommonDbGrid mainPageComp={this.props.mainPageComp} selectAction={null} context={Const.ROOM_EXCLUDE_OBJECT}/>
            </div>
        )
    }

}