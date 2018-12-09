import React, {Component} from "react";
import CommonDbGrid from '../grid/CommonDbGrid';
import * as Const from '../../Const';

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        }
    }

    render() {
        return(
            <CommonDbGrid dataEntityContext={Const.USER_CONTEXT} pageSize={10}/>
        )
    }

}

export default UserList;