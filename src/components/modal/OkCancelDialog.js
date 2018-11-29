import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import questionPng from '../../media/data/question.png';

class OkCancelDialog extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            okCancelVisible:props.okCancelVisible,
            question:props.question,
            cancelAction:props.cancelAction,
            okAction:props.okAction
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.okCancelVisible != this.props.okCancelVisible) {
            this.setState({
                okCancelVisible: this.props.okCancelVisible,
            });
        }
    }

    render() {
        return (
            <Modal visible={this.state.okCancelVisible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'500px',height:'200px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2">Вопрос</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={this.state.cancelAction} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{height:'100px',overflow:'auto'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'7%'}}><img alt='' src={questionPng} style={{height:"24px",width:"24px"}}/></td>
                                <td style={{width:'93%'}}>{this.state.question}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <div className="btn-group mr-2" role="group">
                            <input id="okButton" type="button" value="Ок" className="btn btn-primary" onClick={this.state.okAction}/>
                        </div>
                        <div className="btn-group mr-2" role="group">
                            <input id="cancelButton" type="button" value="Отмена" className="btn btn-primary" onClick={this.state.cancelAction}/>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default OkCancelDialog;