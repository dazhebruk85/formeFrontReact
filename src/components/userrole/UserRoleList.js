import React, {Component} from "react";
import CommonDbGrid from '../grid/CommonDbGrid';
import * as Const from '../../Const';

class UserRoleList extends Component {

    constructor(props) {
        super(props);

        this.state = {
           filter: {}
        };
    }

    render() {
        return(
            <div id='ULMainDiv'>
                <CommonDbGrid ref={'ULUserRoleGrid'} dataEntityContext={Const.USER_ROLE_CONTEXT} pageSize={10}/>
            </div>
        )
    }
}

export default UserRoleList;