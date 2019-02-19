import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import Field from '../../baseComponent/field/Field'
import Button from './../../baseComponent/field/Button'
import DictField from '../../baseComponent/field/DictField'
import InfoModal from "../../baseComponent/modal/InfoModal";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import Label from "../../baseComponent/fieldMy/Label";
import TextField from "../../baseComponent/fieldMy/TextField";
import TextAreaField from "../../baseComponent/fieldMy/TextAreaField";

class UserEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            isLoading:false,
            successInfoMessages:[],
            fields:{
                common:{
                    entityId:props.entityId,
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
                    userRoleName:'',
                    userRoleId:''
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveEntityData = this.saveEntityData.bind(this);
        this.getEntityData = this.getEntityData.bind(this);
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
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_GET,params);
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
            fields:{
                ...this.state.fields,
                common:{
                    ...this.state.fields.common,
                    entityId:'',
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
                    userRoleName:'',
                    userRoleId:''
                }
            }
        });
        this.closeAction()
    }

    async saveEntityData() {
        let errors = [];
        if (!this.state.fields.common.fio) {errors.push({code:'',message:'Необходимо заполнить ФИО'})}
        if (!this.state.fields.common.login) {errors.push({code:'',message:'Необходимо заполнить Логин'})}
        if (!this.state.fields.common.birthDate) {errors.push({code:'',message:'Необходимо заполнить дату рождения'})}
        if (!this.state.fields.common.phone) {errors.push({code:'',message:'Необходимо заполнить телефон'})}
        if (!this.state.fields.common.email) {errors.push({code:'',message:'Необходимо заполнить email'})}
        if (!this.state.fields.common.passportSeries) {errors.push({code:'',message:'Необходимо заполнить серию паспорта'})}
        if (!this.state.fields.common.passportNumber) {errors.push({code:'',message:'Необходимо заполнить номер паспорта'})}
        if (!this.state.fields.common.passportIssuedBy) {errors.push({code:'',message:'Необходимо заполнить орган, выдавший паспорт'})}
        if (!this.state.fields.common.regAddress) {errors.push({code:'',message:'Необходимо заполнить адрес регистрации'})}
        if (!this.state.fields.common.userRoleName) {errors.push({code:'',message:'Необходимо заполнить роль пользователя'})}
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({isLoading:true});
            let params = this.state.fields;
            params['entityId'] = this.state.fields.common.entityId;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_SAVE,params);
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Данные пользователя сохранены'}]});
            }
        }
    }

    chooseUserRole(selectedRole){
        this.setState({
            fields:{
                ...this.state.fields,
                common:{
                    ...this.state.fields.common,
                    userRoleName: selectedRole ? selectedRole.name  : '',
                    userRoleId: selectedRole ? selectedRole.entityId  : ''
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
                        <TextField width={'300px'} value={this.state.fields.common.fio} onChange={(event) => this.handleChange(event.target.value,'fio','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Логин'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.common.login} onChange={(event) => this.handleChange(event.target.value,'login','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Дата рождения'} width={'115px'}/>
                        <Field fieldWidth='300px' type={Const.DATEPICKER} value={this.state.fields.common.birthDate} onChange={(date) => this.handleChange(date,'birthDate','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Паспорт серия'} width={'115px'}/>
                        <TextField width={'100px'} value={this.state.fields.common.passportSeries} onChange={(event) => this.handleChange(event.target.value,'passportSeries','common')}/>
                        <Label value={'номер'} width={'100px'}/>
                        <TextField width={'100px'} value={this.state.fields.common.passportNumber} onChange={(event) => this.handleChange(event.target.value,'passportNumber','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'выдан'} width={'115px'}/>
                        <TextAreaField style={{resize:'none',height:'75px'}} width={'300px'} value={this.state.fields.common.passportIssuedBy} onChange={(event) => this.handleChange(event.target.value,'passportIssuedBy','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Адрес'} width={'115px'}/>
                        <TextAreaField style={{resize:'none',height:'75px'}} width={'300px'} value={this.state.fields.common.regAddress} onChange={(event) => this.handleChange(event.target.value,'regAddress','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Телефон'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.common.phone} onChange={(event) => this.handleChange(event.target.value,'phone','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Email'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.common.email} onChange={(event) => this.handleChange(event.target.value,'email','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Skype'} width={'115px'}/>
                        <TextField width={'300px'} value={this.state.fields.common.skype} onChange={(event) => this.handleChange(event.target.value,'skype','common')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Роль'} width={'115px'}/>
                        <DictField labelWidth='150px'
                                   fieldWidth='300px'
                                   type={Const.TEXTFIELD}
                                   value={this.state.fields.common.userRoleName}
                                   placeholder=''
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