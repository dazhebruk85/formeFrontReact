import {Component} from "react";
import CommonModal from "../../baseComponent/modal/CommonModal";
import React from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import InfoModal from "../../baseComponent/modal/InfoModal";
import * as Const from "../../../Const";
import Button from "../../baseComponent/field/Button";
import fillByDefaultPng from "../../../media/common/fillByDefault.png";
import OkCancelDialog from "../../baseComponent/modal/OkCancelDialog";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import Label from "../../baseComponent/field/Label";
import TextField from "../../baseComponent/field/TextField";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import TextAreaField from "../../baseComponent/field/TextAreaField";

class ConfigParamEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            isLoading:false,
            closeAction:props.closeAction,
            successInfoMessages:[],
            setValueByDefaultDialogVisible:false,
            fields:{
                common:{
                    entityId: '',
                    name:'',
                    systemName:'',
                    value:'',
                    defaultValue:''
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getEntityData = this.getEntityData.bind(this);
        this.saveEntityData = this.saveEntityData.bind(this);
        this.setValueByDefaultValue = this.setValueByDefaultValue.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.entityId !== prevProps.entityId ) {
            this.setState({
                fields:{
                    ...this.state.fields,
                    common:{
                        ...this.state.fields.common,
                        entityId:this.props.entityId
                    }
                }
            });
        }
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            setTimeout(() => this.getEntityData(), 0);
        }
    }

    async getEntityData() {
        if (this.state.fields.common.entityId) {
            this.setState({isLoading:true});
            let params = {entityId: this.state.fields.common.entityId};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CONFIG_PARAM_CONTEXT,Const.ENTITY_GET,params);
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({fields: responseData.params});
            }
        }
    }

    closeModal() {
        this.setState({
            errors:[],
            successInfoMessages:[],
            setValueByDefaultDialogVisible:false,
            fields:{
                ...this.state.fields,
                common : {
                    ...this.state.fields.common,
                    entityId: '',
                    name:'',
                    systemName:'',
                    value:'',
                    defaultValue:''
                }
            }
        });
        this.closeAction()
    }

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    async saveEntityData() {
        let errors = [];
        if (!this.state.fields.common.value) {errors.push({code:'',message:'Необходимо заполнить значение параметра'})}
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({isLoading:true});
            let params = this.state.fields;
            params['entityId'] = this.state.fields.common.entityId;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CONFIG_PARAM_CONTEXT,Const.ENTITY_SAVE,params);
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Данные параметра сохранены'}]});
            }
        }
    }

    setValueByDefaultValue() {
        this.setState({
            setValueByDefaultDialogVisible:false,
            fields:{
                ...this.state.fields,
                common : {
                    ...this.state.fields.common,
                    value:this.state.fields.common.defaultValue
                }
            }
        })
    }

    render() {
        return(
            <CommonModal loading={this.state.isLoading} title={'Системный параметр'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Наименование'} width={'200px'}/>
                        <TextField width={'350px'} value={this.state.fields.common.name} onChange={(event) => this.handleChange(event.target.value,'name','common')} disabled={true}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Системное наименование'} width={'200px'}/>
                        <TextField width={'350px'} value={this.state.fields.common.systemName} onChange={(event) => this.handleChange(event.target.value,'systemName','common')} disabled={true}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Значение'} width={'200px'}/>
                        <TextAreaField ref={'ConfigParamTA'} style={{resize:'none',height:'75px'}} width={'350px'} maxLength={4000} value={this.state.fields.common.value} onChange={(event) => this.handleChange(event.target.value,'value','common')}/>
                        <img title={'Загрузить данные по умолчанию'} alt={''} src={fillByDefaultPng} style={{opacity:'1',position:'relative',marginBottom:'50px',marginLeft:'-40px',width:'20px',height:'20px',cursor:'pointer'}} onClick={() => this.setState({setValueByDefaultDialogVisible:true})}/>
                    </HorizontalPanel>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.saveEntityData()}/>
                        <Button value="Отмена" onClick={() => this.closeModal()}/>
                    </div>
                </VerticalPanel>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages: []}); this.closeModal()}}/>
                <OkCancelDialog okCancelVisible={this.state.setValueByDefaultDialogVisible}
                                cancelAction={() => this.setState({setValueByDefaultDialogVisible:false})}
                                okAction={() => this.setValueByDefaultValue()}>
                    <div>Вы действительно хотите заполнить значение параметра значением по умолчанию?</div>
                </OkCancelDialog>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </CommonModal>
        )
    }

}

export default ConfigParamEditForm