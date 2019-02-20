import {Component} from "react";
import React from "react";

export default class VerticalPanel extends Component {

    render() {

        let panelStyle = this.props.style ? this.props.style : {};

        let tableStyle = {};
        if (panelStyle.width === '100%') {
            tableStyle.width = '100%';
        }

        function addChild(child,index) {
            return (
                <tr key={'verticalPanelTr'+index}>
                    <td key={'verticalPanelTd'+index}>
                        {child}
                    </td>
                </tr>
            )
        }

        function addChildren(children) {
            if (children instanceof Array) {
                return (
                    children.map((item, index) => (
                        addChild(item,index)
                    ))
                )
            } else {
                return (
                    addChild(children,0)
                )
            }
        }

        return (
            <div style={panelStyle}>
                <table style={tableStyle}>
                    <tbody>
                        {addChildren(this.props.children)}
                    </tbody>
                </table>
            </div>
        )
    }
}