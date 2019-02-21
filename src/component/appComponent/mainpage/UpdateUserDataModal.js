import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as Const from '../../../Const';
import InfoModal from "../../baseComponent/modal/InfoModal";
import Button from './../../baseComponent/field/Button'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as CommonUtils from "../../../utils/CommonUtils";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import Label from "../../baseComponent/field/Label";
import TextField from "../../baseComponent/field/TextField";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import TextAreaField from "../../baseComponent/field/TextAreaField";
import DateField from "../../baseComponent/field/DateField";

class UpdateUserDataModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            successInfoMessages:[],
            isLoading:false,
            fields:{
                fio:'',
                birthDate:undefined,
                phone:'',
                email:'',
                skype:'',
                passportSeries:'',
                passportNumber:'',
                passportIssuedBy:'',
                regAddress:'',
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveUserData = this.saveUserData.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.getUserData()
        }
    }

    async getUserData() {
        this.setState({isLoading:true});
        let params = {entityId: CommonUtils.getFormLocalStorage('userId')};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_GET,params);
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
            fields:{
                ...this.state.fields,
                fio:'',
                birthDate:undefined,
                phone:'',
                email:'',
                skype:'',
                passportSeries:'',
                passportNumber:'',
                passportIssuedBy:'',
                regAddress:'',
            }
        });
        this.closeAction()
    }

    async saveUserData() {
        let errors = []
        if (!this.state.fields.fio) {errors.push({code:'',message:'Необходимо заполнить ФИО'})}
        if (!this.state.fields.birthDate) {errors.push({code:'',message:'Необходимо заполнить дату рождения'})}
        if (!this.state.fields.phone) {errors.push({code:'',message:'Необходимо заполнить телефон'})}
        if (!this.state.fields.email) {errors.push({code:'',message:'Необходимо заполнить email'})}
        if (!this.state.fields.passportSeries) {errors.push({code:'',message:'Необходимо заполнить серию паспорта'})}
        if (!this.state.fields.passportNumber) {errors.push({code:'',message:'Необходимо заполнить номер паспорта'})}
        if (!this.state.fields.passportIssuedBy) {errors.push({code:'',message:'Необходимо заполнить орган, выдавший паспорт'})}
        if (!this.state.fields.regAddress) {errors.push({code:'',message:'Необходимо заполнить адрес регистрации'})}
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({isLoading:true});
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_SAVE,{entityId:CommonUtils.getFormLocalStorage('userId')},JSON.stringify(this.state.fields));
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Данные пользователя сохранены'}]});
            }
        }
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
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button value="Ок" onClick={() => this.saveUserData()}/>
                        <Button value="Отмена" onClick={() => this.closeModal()}/>
                    </div>
                </VerticalPanel>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages:[]});this.closeModal()}}/>
            </CommonModal>
        )
    }
}

export default UpdateUserDataModal;
