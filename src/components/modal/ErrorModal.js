import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import errorPng from "../../media/data/error.png";
import Button from './../field/Button'
import * as CommonUtils from "../../utils/CommonUtils";

class ErrorModal extends Modal {

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
            <Modal visible={this.props.errors.length > 0} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'450px',height:'200px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2">Ошибка</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={this.props.closeAction} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{height:'100px',overflow:'auto'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <ErrorList dataList={this.props.errors}/>
                            </tbody>
                        </table>
                    </div>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button id="EMOkButton" value="Ок" onClick={this.props.closeAction}/>
                        <Button id="EMReturnToLoginPageButton" value="На страницу логина" onClick={this.props.closeAction} visible={sessionExpire}/>
                    </div>
                </div>
            </Modal>
        )
    }

}

export default ErrorModal;