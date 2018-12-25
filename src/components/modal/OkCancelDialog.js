import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import questionPng from '../../media/data/question.png';
import Button from './../field/Button'

class OkCancelDialog extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            okCancelVisible:false,
            question:props.question,
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
            <Modal visible={this.state.okCancelVisible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'450px',height:'170px',marginBottom:'0px'}}>
                    <div className="panel-heading" style={{height:'30px',padding:'2px 10px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2">Вопрос</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={this.state.cancelAction} align={'right'} src={closePng} style={{cursor:'pointer',height:"20px",width:"20px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{height:'80px',overflow:'auto'}}>
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
                        <Button value="Ок" onClick={this.state.okAction}/>
                        <Button value="Отмена" onClick={this.state.cancelAction}/>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default OkCancelDialog;