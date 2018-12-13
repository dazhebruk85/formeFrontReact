import React, {Component}from 'react';
import dictPng from '../../media/data/dictionary.png'
import dictClearPng from '../../media/data/dictionaryClear.png'
import Modal from 'react-awesome-modal';
import closePng from '../../media/data/close.png';
import Button from './../field/Button';
import CommonDbGrid from '../grid/CommonDbGrid';

class DictionaryField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selectedEntity:null
        }

        this.openDict = this.openDict.bind(this);
        this.closeDict = this.closeDict.bind(this);
        this.chooseDictAction = props.chooseDictAction
    }

    openDict() {
        this.setState({
            visible : true
        })
    }

    closeDict() {
        this.setState({
            visible : false
        })
    }

    changeGridSelection(selectedEntity) {
        this.setState({
            selectedEntity: selectedEntity
        });
    }

    chooseDict() {
        setTimeout(() => this.chooseDictAction(this.state.selectedEntity), 0);
        this.closeDict()
    }

    clearDict() {
        setTimeout(() => this.chooseDictAction(null), 0);
    }

    render() {
        return(
            <div className="form-group">
                {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{width:'100%'}}>
                                <input className="form-control"
                                       ref={this.props.id}
                                       id={this.props.id}
                                       value={this.props.value}
                                       onChange={this.props.onChange}
                                       placeholder={this.props.placeholder}
                                       maxLength={this.props.maxLength}
                                       style={this.props.style}
                                       type="text"
                                       disabled={true}/>
                            </td>
                            <td>
                                <img title={'Открыть справочник'} alt={''} src={dictPng} style={{marginLeft:'5px',width:'20px',height:'20px',cursor:'pointer'}} onClick={this.openDict}/>
                            </td>
                            <td>
                                <img title={'Очистить'} alt={''} src={dictClearPng} style={{marginLeft:'5px',width:'20px',height:'20px',cursor:'pointer'}} onClick={() => this.clearDict()}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <Modal visible={this.state.visible} effect="fadeInDown">
                    <div className="panel panel-default" style={{width:'650px',height:'520px',marginBottom:'0px'}}>
                        <div className="panel-heading" style={{height:'45px'}}>
                            <table style={{width:'100%'}}>
                                <tbody>
                                <tr>
                                    <td style={{width:'90%'}}>
                                        <label style={{textAlign:'left',width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2">Справочник</label>
                                    </td>
                                    <td style={{width:'10%',alignItems:'right'}}>
                                        <img alt='' onClick={this.closeDict} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="panel-body" style={{height:'420px',overflow:'auto'}} onDoubleClick={() => this.chooseDict()}>
                            <CommonDbGrid selectAction={this.changeGridSelection.bind(this)} ref={'DFDictGrid'} dataEntityContext={this.props.context} pageSize={10}/>
                        </div>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <Button value="Ок" onClick={() => this.chooseDict()}/>
                            <Button value="Отмена" onClick={() => this.closeDict()}/>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default DictionaryField;