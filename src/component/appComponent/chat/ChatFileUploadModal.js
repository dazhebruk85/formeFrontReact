import React, {Component} from "react";
import CommonModal from "../../baseComponent/modal/CommonModal";
import Button from "../../baseComponent/field/Button";
import FileUploadField from "../../baseComponent/field/FileUploadField";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import * as CommonUtils from "../../../utils/CommonUtils";
import * as Const from "../../../Const";
import Field from "../../baseComponent/field/Field";

class ChatFileUploadModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            cancelAction:props.cancelAction,
            okAction:props.okAction,
            fields:{
                common:{
                    message:''
                }
            }
        };

        this.selectFile = this.selectFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.refs.FileUploadField.clearFile();
            this.setState({
                fields:{
                    ...this.state.fields,
                    common:{
                        ...this.state.fields.common,
                        message:''
                    }
                }
            })
        }
    }

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    selectFile() {
        if (this.refs.FileUploadField.state.selectedFile.size > 0) {
            this.state.okAction({file:this.refs.FileUploadField.state.selectedFile,message:this.state.fields.common.message});
        } else {
            this.setState({errors: [{code:'NO_FILE_ERROR',message:'Необходимо выбрать файл'}]});
        }
    }

    render() {
        return(
            <CommonModal title={'Отправить файл'} visible={this.props.visible} style={{width:'450px'}} closeAction={this.state.cancelAction}>
                <div className="form-horizontal">
                    <FileUploadField mainPageComp={this.props.mainPageComp} style={{marginBottom:'10px'}} labelWidth='130px' fieldWidth='303px' label='Выбрать файл' ref={'FileUploadField'}/>
                    <Field placeholder={'Введите сообщение'} formStyle={{marginRight:'0px'}} fieldWidth='100%' style={{resize:'none',height:'70px'}} maxLength={1000} type={Const.TEXTAREA} value={this.state.fields.common.message} onChange={(event) => this.handleChange(event.target.value,'message','common')}/>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.selectFile()}/>
                        <Button value="Отмена" onClick={this.state.cancelAction}/>
                    </div>
                </div>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </CommonModal>
        )
    }

}

export default ChatFileUploadModal;