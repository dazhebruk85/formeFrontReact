import React, {Component} from "react";
import CommonModal from "./CommonModal";
import Button from "../field/Button";
import FileUploadField from "../field/FileUploadField";
import ErrorModal from "./ErrorModal";

class FileUploadModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            cancelAction:props.cancelAction,
            okAction:props.okAction
        };

        this.selectFile = this.selectFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.refs.FileUploadField.clearFile()
        }
    }

    selectFile() {
        if (this.refs.FileUploadField.state.selectedFile.size > 0) {
            this.state.okAction(this.refs.FileUploadField.state.selectedFile);
        } else {
            this.setState({errors: [{code:'NO_FILE_ERROR',message:'Необходимо выбрать файл'}]});
        }
    }

    render() {
        return(
            <CommonModal title={'Выбрать файл'} visible={this.props.visible} style={{width:'450px'}} closeAction={this.state.cancelAction}>
                <div className="form-horizontal">
                    <FileUploadField style={{marginBottom:'10px'}} labelWidth='130px' fieldWidth='303px' label='Выбрать файл' ref={'FileUploadField'}/>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.selectFile()}/>
                        <Button value="Отмена" onClick={this.state.cancelAction}/>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </CommonModal>
        )
    }

}

export default FileUploadModal;