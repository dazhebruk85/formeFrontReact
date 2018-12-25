import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import cookie from 'react-cookies';
import UniversalField from './../../baseComponent/field/UniversalField'
import Button from './../../baseComponent/field/Button'
import DictionaryField from './../../baseComponent/field/DictionaryField'
import InfoModal from "../../baseComponent/modal/InfoModal";

class UserEditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            isLoading: false,
            closeAction:props.closeAction,
            successInfoMessages: [],
            fields:{
                entityId: props.entityId,
                fio:'',
                login:'',
                birthDate:undefined,
                phone:'',
                email:'',
                passportSeries:'',
                passportNumber:'',
                passportIssuedBy:'',
                regAddress:'',
                userRoleName:'',
                userRoleId:''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveUserData = this.saveUserData.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.entityId !== prevProps.entityId ) {
            this.setState({fields:{...this.state.fields, entityId:this.props.entityId}});
        }
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            setTimeout(() => this.getUserData(), 0);
        }
    }

    async getUserData() {
        if (this.state.fields.entityId) {
            this.setState({isLoading:true});
            let params = {entityId: this.state.fields.entityId};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_GET,params,cookie.load('sessionId'));
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setUserData({data: responseData.params});
            }
        }
    }

    setUserData(props) {
        let propsToChange = {}
        for (var key in props.data) {
            if (props.data.hasOwnProperty(key)) {
                if ("birthDate" === key) {
                    if (props.data[key]) {
                        propsToChange[key] = new Date(props.data[key]);
                    }
                } else {
                    propsToChange[key] = props.data[key] ? props.data[key] : '';
                }
            }
        }
        this.setState({fields: propsToChange});
    }

    closeModal() {
        this.setState({
            errors: [],
            fields:{
                entityId: '',
                fio:'',
                login:'',
                birthDate:undefined,
                phone:'',
                email:'',
                passportSeries:'',
                passportNumber:'',
                passportIssuedBy:'',
                regAddress:'',
                userRoleName:'',
                userRoleId:''
            }
        });
        this.closeAction()
    }

    async saveUserData() {
        let errors = []
        if (!this.state.fields.fio) {
            errors.push({code:'',message:'Необходимо заполнить ФИО'})
        }
        if (!this.state.fields.login) {
            errors.push({code:'',message:'Необходимо заполнить Логин'})
        }
        if (!this.state.fields.birthDate) {
            errors.push({code:'',message:'Необходимо заполнить дату рождения'})
        }
        if (!this.state.fields.phone) {
            errors.push({code:'',message:'Необходимо заполнить телефон'})
        }
        if (!this.state.fields.email) {
            errors.push({code:'',message:'Необходимо заполнить email'})
        }
        if (!this.state.fields.passportSeries) {
            errors.push({code:'',message:'Необходимо заполнить серию паспорта'})
        }
        if (!this.state.fields.passportNumber) {
            errors.push({code:'',message:'Необходимо заполнить номер паспорта'})
        }
        if (!this.state.fields.passportIssuedBy) {
            errors.push({code:'',message:'Необходимо заполнить орган, выдавший паспорт'})
        }
        if (!this.state.fields.regAddress) {
            errors.push({code:'',message:'Необходимо заполнить адрес регистрации'})
        }
        if (!this.state.fields.userRoleName) {
            errors.push({code:'',message:'Необходимо заполнить роль пользователя'})
        }
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({isLoading:true});
            let params = this.state.fields;
            params['birthDateLong'] = params.birthDate.getTime();
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.USER_CONTEXT,Const.ENTITY_SAVE,params,cookie.load('sessionId'));
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
            fields:
                {...this.state.fields,
                    userRoleName: selectedRole ? selectedRole.name  : '',
                    userRoleId: selectedRole ? selectedRole.entityId  : ''
                }
        });
    }

    handleChange(event, fieldName) {
        if (event instanceof Date) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    [fieldName]: event
                }
            });
        } else {
            const value = event.target.value;
            this.setState({
                fields: {
                    ...this.state.fields,
                    [fieldName]: value
                }
            });
        }
    }

    render() {
        return(
            <CommonModal loading={this.state.isLoading} title={'Изменить данные пользователя'} visible={this.props.visible} style={{width:'460px'}} closeAction={() => this.closeModal()}>
                <div>
                    <form className="form-horizontal">
                        <UniversalField labelWidth='150px' fieldWidth='300px' label='ФИО' type={Const.TEXTFIELD} value={this.state.fields.fio} onChange={(event) => this.handleChange(event, 'fio')} placeholder='ФИО' maxLength={255}/>
                        <UniversalField labelWidth='150px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} value={this.state.fields.login} onChange={(event) => this.handleChange(event, 'login')} placeholder='Логин' maxLength={255}/>
                        <UniversalField labelWidth='150px' fieldWidth='300px' label='Дата рождения' type={Const.DATEPICKER} value={this.state.fields.birthDate} onChange={(date) => this.handleChange(date, "birthDate")} placeholder='Дата рождения'/>
                        <div className="form-group">
                            <label style={{width:'150px'}} className="control-label col-sm-2">Паспорт</label>
                            <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <input style={{width:'100px'}} placeholder="Серия" maxLength={4} className="form-control input-sm" type="text" value={this.state.fields.passportSeries} onChange={(event) => this.handleChange(event, 'passportSeries')}/>
                                        </td>
                                        <td style={{width:'10px'}}></td>
                                        <td>
                                            <input placeholder="Номер" maxLength={6} className="form-control input-sm" type="text" value={this.state.fields.passportNumber} onChange={(event) => this.handleChange(event, 'passportNumber')}/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <UniversalField style={{resize:'none',height:'75px'}} labelWidth='150px' fieldWidth='300px' label='выдан' type={Const.TEXTAREA} value={this.state.fields.passportIssuedBy} onChange={(event) => this.handleChange(event, 'passportIssuedBy')} placeholder='Кем выдан паспорт' maxLength={255}/>
                        <UniversalField style={{resize:'none',height:'75px'}} labelWidth='150px' fieldWidth='300px' label='Адрес регистрации' type={Const.TEXTAREA} value={this.state.fields.regAddress} onChange={(event) => this.handleChange(event, 'regAddress')} placeholder='Адрес регистрации' maxLength={255}/>
                        <UniversalField labelWidth='150px' fieldWidth='300px' label='Телефон' type={Const.TEXTFIELD} value={this.state.fields.phone} onChange={(event) => this.handleChange(event, 'phone')} placeholder='Телефон' maxLength={100}/>
                        <UniversalField labelWidth='150px' fieldWidth='300px' label='Email' type={Const.TEXTFIELD} value={this.state.fields.email} onChange={(event) => this.handleChange(event, 'email')} placeholder='Email' maxLength={100}/>
                        <DictionaryField labelWidth='150px'
                                         fieldWidth='300px'
                                         label='Роль пользователя'
                                         type={Const.TEXTFIELD}
                                         value={this.state.fields.userRoleName}
                                         placeholder=''
                                         maxLength={100}
                                         context={Const.USER_ROLE_CONTEXT}
                                         chooseDictAction={this.chooseUserRole.bind(this)}/>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <Button value="Ок" onClick={() => this.saveUserData()}/>
                            <Button value="Отмена" onClick={() => this.closeModal()}/>
                        </div>
                    </form>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages: []}); this.closeModal()}}/>
            </CommonModal>
        )
    }
}

export default UserEditForm;