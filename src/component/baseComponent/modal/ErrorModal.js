import React, {Component} from "react";
import errorPng from "../../../media/common/error.png";
import Button from './../field/Button'
import * as CommonUtils from "../../../utils/CommonUtils";
import CommonModal from './CommonModal'

class ErrorModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: []
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.errors !== prevProps.errors) {
            this.setState({errors: this.props.errors});
        }
    }

    redirectToLoginPage(evt){
        this.props.mainPageComp.setState({
            sessionId: ''
        })
    }

    render() {

        let sessionExpire = false;
        if (this.props && this.props.errors && this.props.errors.length > 0) {
            for (let error in this.props.errors) {
                if("SYS_SESSION_EXPIRED" === this.props.errors[error].code) {
                    sessionExpire = true;
                    break;
                }
            }
        }

        function ErrorList(props) {
            if (props.dataList.length > 0) {

                let dataList = props.dataList.map((dataObj) =>
                    <tr key={CommonUtils.genGuid()} style={{height:'30px'}}>
                        <td key={CommonUtils.genGuid()} style={{width:'7%'}}>
                            <div key={CommonUtils.genGuid()}>
                                <img alt='' src={errorPng} style={{height:"24px",width:"24px"}}/>
                            </div>
                        </td>
                        <td key={CommonUtils.genGuid()} style={{width:'93%'}}>
                            <div key={CommonUtils.genGuid()}>{dataObj.message}</div>
                        </td>
                    </tr>
                );
                return (
                    dataList
                );
            } else {
                return null
            }
        }

        return(
            <CommonModal title={'Ошибка'} visible={this.state.errors.length > 0} style={{width:'450px',height:'195px'}} closeAction={this.props.closeAction}>
                <div style={{height:'100px',overflow:'auto'}}>
                    <table style={{width:'100%'}}>
                        <tbody>
                            <ErrorList dataList={this.state.errors}/>
                        </tbody>
                    </table>
                </div>
                <div className="btn-toolbar align-bottom" role="toolbar" style={{paddingTop:'5px',justifyContent:'center',display:'flex'}}>
                    <Button value="Ок" onClick={this.props.closeAction}/>
                    <Button value="На страницу логина" onClick={this.redirectToLoginPage.bind(this)} visible={sessionExpire}/>
                </div>
            </CommonModal>
        )
    }
}

export default ErrorModal;