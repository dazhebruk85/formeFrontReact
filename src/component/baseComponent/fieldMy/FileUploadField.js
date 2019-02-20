import React, {Component} from 'react';
import chooseFilePng from "../../../media/fileUpload/chooseFile.png";
import clearFilePng from "../../../media/common/clear.png";
import $ from "jquery";
import * as FileUtils from '../../../utils/FileUtils';
import ErrorModal from "../modal/ErrorModal";
import HorizontalPanel from "../panel/HorizontalPanel";
import VerticalPanel from "../panel/VerticalPanel";

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
            <div>
                <VerticalPanel>
                    <HorizontalPanel style={{marginBottom:'0px'}}>
                        <div className="col-sm-10" style={{width:this.props.width,paddingRight:'0px'}}>
                            <input className="form-control input-sm"
                                   value={this.state.selectedFile.name}
                                   placeholder={this.props.placeholder}
                                   style={this.props.style}
                                   type="text"
                                   disabled={true}/>
                        </div>
                        <img title={'Выбрать файл'} alt={''} src={chooseFilePng} style={{opacity:fileUploadDisabled?'0.5':'1',marginLeft:'-42px',width:'16px',height:'16px',cursor:'pointer',position:'relative'}} onClick={fileUploadDisabled ? null : () => this.selectFile()}/>
                        <img title={'Очистить'} alt={''} src={clearFilePng} style={{opacity:fileUploadDisabled?'0.5':'1',marginLeft:'-22px',width:'16px',height:'16px',cursor:'pointer',position:'relative'}} onClick={fileUploadDisabled ? null : () => this.clearFile()}/>
                    </HorizontalPanel>
                </VerticalPanel>
                <input className={'hiddenFileInput'}
                       onChange={this.onChangeHiddenFileInput}
                       style={{visibility:'hidden',height:'0px'}}
                       type="file"/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }
}

export default FileUploadField;