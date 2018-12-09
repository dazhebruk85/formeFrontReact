import {Component} from "react";
import spinner from "../../media/spinner.svg";
import React from "react";

class Spinner extends Component {

    componentDidUpdate(prevProps){
        if (prevProps.isLoading !== this.props.isLoading && this.props.isLoading) {
            let spinnerDiv = this.refs.spinnerDiv;
            if (spinnerDiv) {
                let { clientHeight, clientWidth } =  spinnerDiv.parentNode;
                this.refs.spinnerDiv.style.height = clientHeight+'px';
                this.refs.spinnerDiv.style.width = clientWidth+'px';
            }
        }
    }

    render() {
        return (
            <div ref='spinnerDiv' id='loadingDiv' style={{visibility:this.props.isLoading ? 'visible':'hidden',borderRadius:'3px',background:'black',opacity:'0.4',position:'fixed',width:'inherit',height:'inherit',zIndex:'5'}}>
                <img alt='' src={spinner} style={{position:'absolute',top:'25%',left:'40%'}}/>
            </div>
        )
    }

}

export default Spinner;