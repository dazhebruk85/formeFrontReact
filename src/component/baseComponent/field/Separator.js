import {Component} from "react";
import React from "react";
import './../../../media/separator/separator.css';

export default class Separator extends Component {

    render() {
        return (
            <h1 className="separator"><span className={'separatorSpan'}>{this.props.text}</span></h1>
        )
    }
}