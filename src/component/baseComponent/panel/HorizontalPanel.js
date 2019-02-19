import {Component} from "react";
import React from "react";

export default class HorizontalPanel extends Component {

    render() {

        function addChild(child,index) {
            return (
                <td key={'horizontalPanelTd'+index}>
                    {child}
                </td>
            )
        }

        function addChildren(children) {
            if (children instanceof Array) {
                return (
                    <tr key={'horizontalPanelTr'+0}>
                        {children.map((item, index) => (
                            addChild(item,index)
                        ))}
                    </tr>
                )
            } else {
                return (
                    <tr key={'horizontalPanelTr'+0}>
                        {addChild(children,0)}
                    </tr>
                )
            }
        }

        return (
            <div style={{marginBottom:'5px'}}>
                <table>
                    <tbody>
                    {addChildren(this.props.children)}
                    </tbody>
                </table>
            </div>
        )
    }
}

