import React, {Component} from "react";
import CommonModal from './CommonModal'
import infoPng from "../../../media/common/info.png";
import * as CommonUtils from "../../../utils/CommonUtils";
import Button from './../field/Button'
import VerticalPanel from "../panel/VerticalPanel";

class InfoModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            popupVisible:false,
            popupData:[],
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
        function PopupDataList(props) {
            if (props.dataList.length > 0) {

                let dataList = props.dataList.map((dataObj) =>
                    <tr key={CommonUtils.genGuid()} style={{height:'30px'}}>
                        <td key={CommonUtils.genGuid()} style={{width:'7%'}}>
                            <div key={CommonUtils.genGuid()}>
                                <img alt='' src={infoPng} style={{margin:'3px',height:"24px",width:"24px"}}/>
                            </div>
                        </td>
                        <td key={CommonUtils.genGuid()} style={{width:'93%'}}>
                            <div key={CommonUtils.genGuid()} style={{margin:'3px'}}>{dataObj.message}</div>
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

        return (

            <CommonModal title={'Информация'} visible={this.state.popupVisible} style={{width:'450px',height:'150px'}} closeAction={this.props.closeAction}>
                <VerticalPanel style={{width:'100%'}}>
                    <div style={{width:'100%',height:'80px',overflow:'auto'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <PopupDataList dataList={this.state.popupData}/>
                            </tbody>
                        </table>
                    </div>
                </VerticalPanel>
                <div className="btn-toolbar align-bottom" role="toolbar" style={{paddingTop:'5px',justifyContent:'center',display:'flex'}}>
                    <Button value="Ок" onClick={this.props.closeAction}/>
                </div>
            </CommonModal>
        )
    }
}

export default InfoModal;