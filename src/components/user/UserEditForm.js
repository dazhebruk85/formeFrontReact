import React, {Component} from "react";
import Modal from 'react-awesome-modal';
import ErrorModal from '../../components/modal/ErrorModal';
import Spinner from "../spinner/Spinner";
import * as Const from '../../Const';
import * as CommonUtils from "../../utils/CommonUtils";
import cookie from 'react-cookies';
import closePng from '../../media/data/close.png';
import UniversalField from './../field/UniversalField'
import Button from './../field/Button'
import DictionaryField from './../field/DictionaryField'
import MultiPopup from "../modal/MultiPopup";

class UserEditForm extends Modal {
    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible,
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
            visible: false,
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

    handleChange(event, field) {
        if (field !== null && field !== undefined) {
            this.setState({fields:{...this.state.fields,[field]: event}});
        } else {
            const value = event.target.value;
            const id = event.target.id;
            this.setState({fields:{...this.state.fields,[id]: value}});
        }
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
                    userRoleName: selectedRole.name,
                    userRoleId: selectedRole.entityId
                }
        });
    }

    render() {
        return(
            <Modal visible={this.state.visible} effect="fadeInDown">
                <div className="panel panel-default" style={{width:'540px',height:'630px',marginBottom:'0px'}}>
                    <Spinner isLoading={this.state.isLoading}/>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Данные пользователя</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={() => this.closeModal()} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{overflow:'auto'}}>
                        <form className="form-horizontal">
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='ФИО' type={Const.TEXTFIELD} id='fio' value={this.state.fields.fio} onChange={this.handleChange} placeholder='ФИО' maxLength={255}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} id='login' value={this.state.fields.login} onChange={this.handleChange} placeholder='Логин' maxLength={255}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Дата рождения' type={Const.DATEPICKER} id='birthDate' value={this.state.fields.birthDate} onChange={(date) => this.handleChange(date, "birthDate")} placeholder='Дата рождения'/>
                            <div className="form-group">
                                <label style={{width:'220px'}} className="control-label col-sm-2">Паспорт</label>
                                <div className="col-sm-10" style={{width:'300px',paddingRight:'0px'}}>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <input style={{width:'100px'}} placeholder="Серия" id="passportSeries" maxLength={4} className="form-control" type="text" value={this.state.fields.passportSeries} onChange={this.handleChange}/>
                                            </td>
                                            <td style={{width:'10px'}}></td>
                                            <td>
                                                <input placeholder="Номер" id="passportNumber" maxLength={6} className="form-control" type="text" value={this.state.fields.passportNumber} onChange={this.handleChange}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <UniversalField style={{resize:'none',height:'75px'}} labelWidth='220px' fieldWidth='300px' label='выдан' type={Const.TEXTAREA} id='passportIssuedBy' value={this.state.fields.passportIssuedBy} onChange={this.handleChange} placeholder='Кем выдан паспорт' maxLength={255}/>
                            <UniversalField style={{resize:'none',height:'75px'}} labelWidth='220px' fieldWidth='300px' label='Адрес регистрации' type={Const.TEXTAREA} id='regAddress' value={this.state.fields.regAddress} onChange={this.handleChange} placeholder='Адрес регистрации' maxLength={255}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Телефон' type={Const.TEXTFIELD} id='phone' value={this.state.fields.phone} onChange={this.handleChange} placeholder='Телефон' maxLength={100}/>
                            <UniversalField labelWidth='220px' fieldWidth='300px' label='Email' type={Const.TEXTFIELD} id='email' value={this.state.fields.email} onChange={this.handleChange} placeholder='Email' maxLength={100}/>
                            <DictionaryField labelWidth='220px'
                                             fieldWidth='300px'
                                             label='Роль пользователя'
                                             type={Const.TEXTFIELD}
                                             id='userRoleName'
                                             value={this.state.fields.userRoleName}
                                             placeholder=''
                                             maxLength={100}
                                             context={Const.USER_ROLE_CONTEXT}
                                             chooseDictAction={this.chooseUserRole.bind(this)}/>
                            <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                                <Button id="UEFOkButton" value="Ок" onClick={() => this.saveUserData()}/>
                                <Button id="UEFCancelButton" value="Отмена" onClick={() => this.closeModal()}/>
                            </div>
                        </form>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <MultiPopup popupData={this.state.successInfoMessages}
                            popupType={Const.INFO_POPUP}
                            closeAction={() => {this.setState({successInfoMessages: []}); this.closeModal()}}/>
            </Modal>
        )
    }
}

export default UserEditForm;