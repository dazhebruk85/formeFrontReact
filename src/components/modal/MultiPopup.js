import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from "../../media/data/close.png";
import errorPng from "../../media/data/error.png";
import warningPng from "../../media/data/warning.png";
import infoPng from "../../media/data/info.png";
import * as CommonUtils from "../../utils/CommonUtils";
import * as Const from '../../Const';

class MultiPopup extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            popupVisible:false,
            popupData:[],
            closeAction:props.closeAction,
            popupType:props.popupType
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.popupData !== this.props.popupData) {
            if (this.props.popupData.length > 0) {
                this.setState({
                    popupData: this.props.popupData,
                    popupVisible: true
                });
            } else {
                this.setState({
                    popupData: this.props.popupData,
                    popupVisible: false
                });
            }
        }
    }

    render() {
        let popupUiDataForRender = popupUiData(this.state.popupType);
        function PopupDataList(props) {
            if (props.dataList.length > 0) {

                let dataList = props.dataList.map((dataObj) =>
                    <tr key={CommonUtils.genGuid()} style={{height:'30px'}}>
                        <td key={CommonUtils.genGuid()} style={{width:'7%'}}>
                            <div key={CommonUtils.genGuid()}>
                                <img alt='' src={popupUiDataForRender.png} style={{height:"24px",width:"24px"}}/>
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

        function popupUiData(popupType) {
            switch(popupType) {
                case Const.ERROR_POPUP:
                    return {png:errorPng,title:'Ошбка'}
                case Const.INFO_POPUP:
                    return {png:infoPng,title:'Информация'}
                case Const.WARNING_POPUP:
                    return {png:warningPng,title:'Предупреждение'}
                default:
                    return {png:null,title:''}
            }
        }

        return (
            <Modal visible={this.state.popupVisible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'450px',height:'200px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2">{popupUiDataForRender.title}</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={this.state.closeAction} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{height:'100px',overflow:'auto'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <PopupDataList dataList={this.state.popupData}/>
                            </tbody>
                        </table>
                    </div>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <div className="btn-group mr-2" role="group">
                            <input id="okButton" type="button" value="Ок" className="btn btn-primary" onClick={this.state.closeAction}/>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default MultiPopup;