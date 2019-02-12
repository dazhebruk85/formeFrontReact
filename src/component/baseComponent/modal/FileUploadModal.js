import React, {Component} from "react";
import CommonModal from "./CommonModal";
import Button from "../field/Button";
import FileUploadField from "../field/FileUploadField";

class FileUploadModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cancelAction:props.cancelAction,
            okAction:props.okAction
        };

        this.selectFile = this.selectFile.bind(this);
    }

    selectFile() {
        this.state.okAction()
    }

    render() {
        return(
            <CommonModal title={'Выбрать файл'} visible={this.props.visible} style={{width:'450px',height:'150px'}} closeAction={this.state.cancelAction}>
                <div>
                    <form className="form-horizontal">
                        <FileUploadField labelWidth='130px' fieldWidth='300px' label='Выбрать файл' ref={'FileUploadField'}/>
                    </form>
                </div>
                <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                    <Button value="Ок" onClick={() => this.selectFile()}/>
                    <Button value="Отмена" onClick={this.state.cancelAction}/>
                </div>
            </CommonModal>
        )
    }

}

export default FileUploadModal;