import {Component} from "react";
import React from "react";

export default class HorizontalPanel extends Component {

    render() {

        let panelStyle = this.props.style ? this.props.style : {};
        if (!panelStyle.marginBottom) {
            panelStyle.marginBottom = '5px';
        }

        let tableStyle = {};
        if (panelStyle.width === '100%') {
            tableStyle.width = '100%';
        }

        function addChild(child,index) {
            let childWidth = child.props.width ? child.props.width : '';
            let tdStyle = {};
            if (childWidth === '100%') {
                tdStyle.width = '100%';
            }
            return (
                <td style={tdStyle} key={'horizontalPanelTd'+index}>
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

