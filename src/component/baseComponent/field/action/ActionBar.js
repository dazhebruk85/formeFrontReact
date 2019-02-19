import React, {Component} from 'react';
import * as CommonUtils from "../../../../utils/CommonUtils";
import '../../../../media/common/action/entityAction.css';
import ActionWithDropdown from "./ActionWithDropdown";
import Action from "./Action";

class ActionBar extends Component {

    render() {

        function addAction(child) {
            switch(child.type) {
                case Action:
                    return (
                        <td className={'entityActionTd'} key={CommonUtils.genGuid()}>
                            {child}
                        </td>
                    );
                case ActionWithDropdown:
                    return (
                        <td className={'entityActionTd'} key={CommonUtils.genGuid()}>
                            {child}
                        </td>
                    );
                default:
                    return(null)
            }
        }

        function addActions(children) {
            if (children instanceof Array) {
                return (
                    <tr>
                        {children.map((item, index) => (
                            addAction(item)
                        ))}
                    </tr>
                )
            } else {
                return (
                    <tr>
                        {addAction(children)}
                    </tr>
                )
            }
        }

        return (
            <table>
                <tbody>
                    {addActions(this.props.children)}
                </tbody>
            </table>
        )
    }
}

export default ActionBar;