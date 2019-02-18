import React, {Component} from 'react';
import dictPng from '../../../media/dictionary/dict.png'
import dictClearPng from '../../../media/common/clear.png'
import CommonModal from './../modal/CommonModal';
import Button from './../field/Button';
import CommonDbGrid from '../grid/CommonDbGrid';

class DictField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selectedEntity:null,
            disabled:false
        };

        this.openDict = this.openDict.bind(this);
        this.closeDict = this.closeDict.bind(this);
        this.chooseDictAction = props.chooseDictAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.disabled !== prevProps.disabled) {
            this.setState({
                disabled:this.props.disabled
            });
        }
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

        let dictDisabled = this.state.disabled;

        return(
            <div className="form-group">
                {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                    <table style={{width:'100%'}}>
                        <tbody>
                        <tr>
                            <td style={{width:'100%'}}>
                                <input className="form-control input-sm"
                                       value={this.props.value}
                                       onChange={this.props.onChange}
                                       placeholder={this.props.placeholder}
                                       maxLength={this.props.maxLength}
                                       style={this.props.style}
                                       type="text"
                                       disabled={true}/>
                            </td>
                            <td>
                                <img title={'Открыть справочник'} alt={''} src={dictPng} style={{opacity:dictDisabled?'0.5':'1',marginBottom:'1px',marginLeft:'-42px',width:'16px',height:'16px',cursor:'pointer'}} onClick={dictDisabled ? null : this.openDict}/>
                            </td>
                            <td>
                                <img title={'Очистить'} alt={''} src={dictClearPng} style={{opacity:dictDisabled?'0.5':'1',marginBottom:'1px',marginLeft:'-22px',width:'16px',height:'16px',cursor:'pointer'}} onClick={dictDisabled ? null : () => this.clearDict()}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <CommonModal paddingCloseCross={true} title={'Справочник'} visible={this.state.visible} style={{width:'650px'}} closeAction={this.closeDict}>
                    <div onDoubleClick={() => this.chooseDict()}>
                        <CommonDbGrid mainPageComp={this.props.mainPageComp} filter={this.props.dictFilter} selectAction={this.changeGridSelection.bind(this)} dataEntityContext={this.props.context} pageSize={10}/>
                    </div>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.chooseDict()}/>
                        <Button value="Отмена" onClick={() => this.closeDict()}/>
                    </div>
                </CommonModal>
            </div>
        )
    }
}

export default DictField;