import {Component} from "react";
import React from "react";

export default class VerticalPanel extends Component {

    render() {

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
            <table>
                <tbody>
                    {addChildren(this.props.children)}
                </tbody>
            </table>
        )
    }
}