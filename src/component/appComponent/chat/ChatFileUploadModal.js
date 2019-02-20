import React, {Component} from "react";
import CommonModal from "../../baseComponent/modal/CommonModal";
import Button from "../../baseComponent/field/Button";
import FileUploadField from "../../baseComponent/fieldMy/FileUploadField";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import * as CommonUtils from "../../../utils/CommonUtils";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import Label from "../../baseComponent/fieldMy/Label";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import TextAreaField from "../../baseComponent/fieldMy/TextAreaField";

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
            <CommonModal title={'Отправить файл'} visible={this.props.visible} closeAction={this.state.cancelAction}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Выберите файл'} width={'130px'}/>
                        <FileUploadField ref={'FileUploadField'} width='300px' mainPageComp={this.props.mainPageComp}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <TextAreaField style={{resize:'none',height:'75px'}} width={'430px'} maxLength={1000} value={this.state.fields.common.message} onChange={(event) => this.handleChange(event.target.value,'message','common')} placeholder={'Введите сообщение'}/>
                    </HorizontalPanel>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.selectFile()}/>
                        <Button value="Отмена" onClick={this.state.cancelAction}/>
                    </div>
                </VerticalPanel>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </CommonModal>
        )
    }

}

export default ChatFileUploadModal;