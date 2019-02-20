import {Component} from "react";
import React from "react";

export default class CheckBoxField extends Component {

    constructor(props) {
        super(props);

        this.checkBoxClick = this.checkBoxClick.bind(this);
    }

    checkBoxClick(event) {
        let trNode = event.target.parentNode.parentNode;
        let checkBoxNode = trNode.children[0].children[0];
        checkBoxNode.click()
    }

    render() {

        let checkBoxStyle = this.props.style ? this.props.style : {};
        checkBoxStyle.cursor = 'pointer';
        checkBoxStyle.margin = '0px 5px 0px 0px';
        checkBoxStyle.display = 'inline-block';
        checkBoxStyle.verticalAlign = 'middle';

        return (
            <div style={{whiteSpace:'nowrap',marginBottom:'5px'}}>
                <input type="checkbox"
                       checked={this.props.checked}
                       value={this.props.checked}
                       onChange={this.props.onChange}
                       style={checkBoxStyle}
                       disabled={this.props.disabled}/>
                {this.props.text ? <div onClick={this.props.disabled ? null : (event) => this.checkBoxClick(event)} style={{display:'inline-block',marginBottom:'0px',cursor:'pointer',textAlign:'left'}}>{this.props.text}</div> : null}
            </div>
        )
    }
}