import React, {Component} from "react";
import CommonDbGrid from '../grid/CommonDbGrid';
import * as Const from '../../Const';

class BasePackageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        };
    }

    render() {
        return(
            <div>
                <CommonDbGrid selectAction={null} dataEntityContext={Const.BASE_PACKAGE_CONTEXT} pageSize={10}/>
            </div>
        )
    }
}

export default BasePackageList;