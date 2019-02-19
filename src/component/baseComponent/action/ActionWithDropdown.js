import React, {Component} from 'react';
import '../../../media/common/action/entityAction.css';
import * as CommonUtils from "../../../utils/CommonUtils";

class ActionWithDropdown extends Component {

    openSubActions(children) {
        this.refs.dropDownMenu.style.display = 'block';
    }

    closeSubActions() {
        this.refs.dropDownMenu.style.display = 'none';
    }

    render() {

        function addSubAction(child) {
            return (
                <tr key={CommonUtils.genGuid()}>
                    <td key={CommonUtils.genGuid()}>
                        {child}
                    </td>
                </tr>
            );
        }

        function addSubActions(children) {
            if (children instanceof Array) {
                return (
                    children.map((item, index) => (
                        addSubAction(item)
                    ))
                )
            } else {
                return (
                    addSubAction(children)
                )
            }
        }

        return (
            <div onMouseLeave={() => this.closeSubActions()}>
                <div ref={'dropDownButton'} className={'entityActionDiv'}>
                    <img onMouseOver={() => this.openSubActions()} onClick={this.props.onClick} title={this.props.title}  alt={this.props.alt} src={this.props.src} className={'entityActionImg'}/>
                </div>
                <div ref={'dropDownMenu'} className={'dropDownMenu'} style={{display:'none'}}>
                    <table>
                        <tbody>
                            {addSubActions(this.props.children)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ActionWithDropdown;