import React, {Component} from 'react';
import * as CommonUtils from "../../../../utils/CommonUtils";
import '../../../../media/common/action/entityAction.css';

class ActionBar extends Component {

    render() {

        function addAction(child) {
            return (
                <td className={'entityActionTd'} key={CommonUtils.genGuid()}>
                    {child}
                </td>
            )
        }

        function addActions(children) {

            return (
                <tr>
                    {children.map((item, index) => (
                        addAction(item)
                    ))}
                </tr>
            )
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