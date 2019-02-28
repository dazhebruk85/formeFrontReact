import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import Button from './../../baseComponent/field/Button'
import DictField from '../../baseComponent/field/DictField'
import InfoModal from "../../baseComponent/modal/InfoModal";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import Label from "../../baseComponent/field/Label";
import TextField from "../../baseComponent/field/TextField";
import TextAreaField from "../../baseComponent/field/TextAreaField";
import DateField from "../../baseComponent/field/DateField";

let fieldsObject = {
    id:'',
    fio:'',
    login:'',
    birthDate:undefined,
    phone:'',
    email:'',
    skype:'',
    passportSeries:'',
    passportNumber:'',
    passportIssuedBy:'',
    regAddress:'',
    userRole: {
        id:'',
        name:'',
        systemName:''
    }
};

class UserEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            isLoading:false,
            successInfoMessages:[],
            fields: fieldsObject
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveEntityData = this.saveEntityData.bind(this);
        this.getEntityData = this.getEntityData.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            setTimeout(() => this.getEntityData(), 0);
        }
    }

    async getEntityData() {
        this.setState({isLoading:true});
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,this.props.entityId ? Const.ENTITY_GET : Const.ENTITY_NEW,{id:this.props.entityId});
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({fields: responseData.entity});
        }
    }

    closeModal() {
        this.setState({
            errors:[],
            successInfoMessages:[],
            fields:fieldsObject
        });
        this.closeAction()
    }

    async saveEntityData() {
        this.setState({isLoading:true});
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_SAVE,{id:this.state.fields.id},JSON.stringify(this.state.fields));
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({successInfoMessages: [{code:'INFO',message:'Данные пользователя сохранены'}]});
        }
    }

    chooseUserRole(selectedRole){
        this.setState({
            fields:{
                ...this.state.fields,
                userRole:{
                    ...this.state.fields.userRole,
                    id: selectedRole ? selectedRole.id  : '',
                    name: selectedRole ? selectedRole.name  : '',
                    systemName: selectedRole ? selectedRole.systemName  : '',
                }
            }
        });
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    render() {
        return(
            <CommonModal loading={this.state.isLoading} title={'Изменить данные пользователя'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'ФИО'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.fio} onChange={(event) => this.handleChange(event.target.value,'fio','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Логин'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.login} onChange={(event) => this.handleChange(event.target.value,'login','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Дата рождения'} width={'115px'}/>
                        <DateField width={'300px'} value={this.state.fields.birthDate} onChange={(date) => this.handleChange(date,'birthDate','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Паспорт'} width={'115px'}/>
                        <TextField width={'100px'} value={this.state.fields.passportSeries} onChange={(event) => this.handleChange(event.target.value,'passportSeries','')} placeholder={'Серия'}/>
                        <TextField width={'100px'} value={this.state.fields.passportNumber} onChange={(event) => this.handleChange(event.target.value,'passportNumber','')} placeholder={'Номер'}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'выдан'} width={'115px'}/>
                        <TextAreaField style={{resize:'none',height:'50px'}} width={'300px'} value={this.state.fields.passportIssuedBy} onChange={(event) => this.handleChange(event.target.value,'passportIssuedBy','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Адрес'} width={'115px'}/>
                        <TextAreaField style={{resize:'none',height:'50px'}} width={'300px'} value={this.state.fields.regAddress} onChange={(event) => this.handleChange(event.target.value,'regAddress','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Телефон'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.phone} onChange={(event) => this.handleChange(event.target.value,'phone','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Email'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.email} onChange={(event) => this.handleChange(event.target.value,'email','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Skype'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.skype} onChange={(event) => this.handleChange(event.target.value,'skype','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Роль'} width={'115px'}/>
                        <DictField width='300px'
                                   value={this.state.fields.userRole.name}
                                   maxLength={100}
                                   context={Const.USER_ROLE_CONTEXT}
                                   chooseDictAction={this.chooseUserRole.bind(this)}/>
                    </HorizontalPanel>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.saveEntityData()}/>
                        <Button value="Отмена" onClick={() => this.closeModal()}/>
                    </div>
                </VerticalPanel>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages: []}); this.closeModal()}}/>
            </CommonModal>
        )
    }
}

export default UserEditForm;