import React, {Component} from 'react';
import chooseFilePng from "../../../media/fileUpload/chooseFile.png";
import clearFilePng from "../../../media/common/clear.png";
import $ from "jquery";
import * as FileUtils from '../../../utils/FileUtils';
import ErrorModal from "../modal/ErrorModal";

class FileUploadField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            disabled:false,
            selectedFile:{
                name:'',
                ext:'',
                mimeType:'',
                size:0,
                content:''
            }
        };

        this.selectFile = this.selectFile.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.onChangeHiddenFileInput = this.onChangeHiddenFileInput.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.disabled !== prevProps.disabled) {
            this.setState({
                disabled:this.props.disabled
            });
        }
    }

    selectFile() {
        $('.hiddenFileInput').click()
    }

    clearFile() {
        this.setState({
            selectedFile:{
                ...this.state.selectedFile,
                name:'',
                ext:'',
                mimeType:'',
                size:0,
                content:''
            }
        });
        $('.hiddenFileInput').val('');
    }

    onChangeHiddenFileInput(event) {
        if (event.currentTarget.files[0]) {
            let file = event.currentTarget.files[0];
            if (!file.type) {
                this.setState({errors: [{code:'INCORRECT_FILE_ERROR',message:'Некорректный файл'}]});
                $('.hiddenFileInput').val('');
            } else {
                let fileNameArrForExt = file.name.split('.');
                let fileExt = fileNameArrForExt[fileNameArrForExt.length-1];
                FileUtils.getFileInBase64(file).then(
                    data => {
                        this.setState({
                            selectedFile: {
                                ...this.state.selectedFile,
                                name:file.name,
                                ext:fileExt,
                                mimeType:file.type,
                                size:file.size,
                                content:data
                            }
                        });
                    }
                );
            }
        }
    }

    render() {

        let fileUploadDisabled = this.state.disabled;

        return(
            <div className="form-group" style={{marginBottom:'0px'}}>
                {this.props.label ? <label style={{width:this.props.labelWidth}} className="control-label col-sm-2">{this.props.label}</label> : null}
                <div className="col-sm-10" style={{width:this.props.fieldWidth,paddingRight:'0px'}}>
                    <table style={{width:'100%'}}>
                        <tbody>
                            <tr>
                                <td style={{width:'100%'}}>
                                    <input className="form-control input-sm"
                                           value={this.state.selectedFile.name}
                                           placeholder={this.props.placeholder}
                                           style={this.props.style}
                                           type="text"
                                           disabled={true}/>
                                </td>
                                <td>
                                    <img title={'Выбрать файл'} alt={''} src={chooseFilePng} style={{opacity:fileUploadDisabled?'0.5':'1',marginBottom:'8px',marginLeft:'-42px',width:'16px',height:'16px',cursor:'pointer',position:'relative'}} onClick={fileUploadDisabled ? null : () => this.selectFile()}/>
                                </td>
                                <td>
                                    <img title={'Очистить'} alt={''} src={clearFilePng} style={{opacity:fileUploadDisabled?'0.5':'1',marginBottom:'8px',marginLeft:'-22px',width:'16px',height:'16px',cursor:'pointer',position:'relative'}} onClick={fileUploadDisabled ? null : () => this.clearFile()}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <input className={'hiddenFileInput'}
                       onChange={this.onChangeHiddenFileInput}
                       style={{visibility:'hidden',height:'0px'}}
                       type="file"/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }
}

export default FileUploadField;