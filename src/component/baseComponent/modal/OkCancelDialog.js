import React, {Component} from "react";
import questionPng from '../../../media/common/question.png';
import Button from './../field/Button'
import CommonModal from './CommonModal'
import VerticalPanel from "../panel/VerticalPanel";

class OkCancelDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            okCancelVisible:false,
            cancelAction:props.cancelAction,
            okAction:props.okAction
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.okCancelVisible !== this.props.okCancelVisible) {
            this.setState({
                okCancelVisible: this.props.okCancelVisible,
            });
        }
    }

    render() {
        return (
            <CommonModal title={'Вопрос'} visible={this.state.okCancelVisible} style={{width:'450px',height:'150px'}} closeAction={this.state.cancelAction}>
                <VerticalPanel style={{width:'100%'}}>
                    <div style={{width:'100%',height:'80px',overflow:'auto'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'7%'}}><img alt='' src={questionPng} style={{margin:'3px',height:"24px",width:"24px"}}/></td>
                                <td style={{width:'93%'}}><div style={{margin:'3px'}}>{this.props.children}</div></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </VerticalPanel>
                <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                    <Button value="Ок" onClick={this.state.okAction}/>
                    <Button value="Отмена" onClick={this.state.cancelAction}/>
                </div>
            </CommonModal>
        )
    }
}

export default OkCancelDialog;