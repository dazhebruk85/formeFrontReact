import React from 'react';
import Modal from 'react-awesome-modal';
import closePng from '../../../media/common/close.png';
import Spinner from "../spinner/Spinner";

class CommonModal extends Modal {

    render() {

        let style = this.props.style ? this.props.style : {};
        style.marginBottom = '0px';

        let bodyStyle = this.props.bodyStyle ? this.props.bodyStyle : {};
        bodyStyle.overflow = 'auto';

        return(
            <Modal visible={this.props.visible} effect="fadeInDown">
                <div className="panel panel-default" style={style}>
                    <Spinner isLoading={this.props.loading}/>
                    <div className="panel-heading" style={{height:'28px',padding:'2px 10px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{textAlign:'left',width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2">{this.props.title}</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={this.props.closeAction} align={'right'} src={closePng} style={{cursor:'pointer',height:"18px",width:"18px",marginBottom:this.props.paddingCloseCross ? '0px' : '4px'}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={bodyStyle}>
                        {this.props.children}
                    </div>
                </div>
            </Modal>
        )

    }
}

export default CommonModal;