import {Component} from "react";
import spinner from "../../../media/spinner.svg";
import React from "react";

class Spinner extends Component {

    componentDidUpdate(prevProps){
        if (prevProps.isLoading !== this.props.isLoading && this.props.isLoading) {
            let spinnerDiv = this.refs.spinnerDiv;
            if (spinnerDiv) {
                this.refs.spinnerDiv.style.height = spinnerDiv.parentNode.clientHeight+'px';
                this.refs.spinnerDiv.style.width = spinnerDiv.parentNode.clientWidth+'px';

                this.refs.spinnerSvg.style.top = ((spinnerDiv.parentNode.clientHeight/2)-(this.refs.spinnerSvg.clientHeight/2))+'px';
                this.refs.spinnerSvg.style.left = ((spinnerDiv.parentNode.clientWidth/2)-(this.refs.spinnerSvg.clientWidth/2))+'px';
            }
        }
    }

    render() {
        return (
            <div ref='spinnerDiv' style={{visibility:this.props.isLoading ? 'visible':'hidden',borderRadius:'3px',background:'black',opacity:'0.4',position:'fixed',width:'inherit',height:'inherit',zIndex:'5'}}>
                <img ref='spinnerSvg' alt='' src={spinner} style={{position:'absolute'}}/>
            </div>
        )
    }

}

export default Spinner;