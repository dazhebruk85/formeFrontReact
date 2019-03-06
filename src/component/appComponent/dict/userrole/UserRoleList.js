import React, {Component} from "react";
import CommonDbGrid from '../../../baseComponent/grid/CommonDbGrid';
import * as Const from '../../../../Const';

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
                <CommonDbGrid mainPageComp={this.props.mainPageComp} selectAction={null} ref={'ULUserRoleGrid'} context={Const.USER_ROLE}/>
            </div>
        )
    }
}

export default UserRoleList;