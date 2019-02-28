import React, {Component} from 'react';
import dictPng from '../../../media/dictionary/dict.png'
import dictClearPng from '../../../media/common/clear.png'
import CommonModal from './../modal/CommonModal';
import Button from './../field/Button';
import CommonDbGrid from '../grid/CommonDbGrid';
import HorizontalPanel from "../panel/HorizontalPanel";
import VerticalPanel from "../panel/VerticalPanel";

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
            <div>
                <VerticalPanel>
                    <HorizontalPanel style={{marginBottom:'0px'}}>
                        <div className="col-sm-10" style={{width:this.props.width,paddingRight:'0px'}}>
                            <input className="form-control input-sm"
                                   value={this.props.value}
                                   onChange={this.props.onChange}
                                   placeholder={this.props.placeholder}
                                   maxLength={this.props.maxLength}
                                   style={this.props.style}
                                   type="text"
                                   disabled={true}/>
                        </div>
                        <img title={'Открыть справочник'} alt={''} src={dictPng} style={{opacity:dictDisabled?'0.5':'1',marginBottom:'1px',marginLeft:'-42px',width:'16px',height:'16px',cursor:'pointer',position:'relative'}} onClick={dictDisabled ? null : this.openDict}/>
                        <img title={'Очистить'} alt={''} src={dictClearPng} style={{opacity:dictDisabled?'0.5':'1',marginBottom:'1px',marginLeft:'-22px',width:'16px',height:'16px',cursor:'pointer',position:'relative'}} onClick={dictDisabled ? null : () => this.clearDict()}/>
                    </HorizontalPanel>
                </VerticalPanel>
                <CommonModal paddingCloseCross={true} title={'Справочник'} visible={this.state.visible} style={{width:'650px'}} closeAction={this.closeDict}>
                    <div onDoubleClick={() => this.chooseDict()}>
                        <CommonDbGrid mainPageComp={this.props.mainPageComp} filter={this.props.dictFilter} selectAction={this.changeGridSelection.bind(this)} context={this.props.context}/>
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