import {Component} from "react";
import React from "react";

export default class Label extends Component {

    render() {

        let labelWidth = this.props.width ? this.props.width : '100%';

        return (
            <div onClick={this.props.onClick} style={{width:labelWidth,textAlign:'right',marginBottom:'0px'}} className="control-label col-sm">{this.props.value}</div>
        )
    }

}