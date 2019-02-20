import React, {Component} from 'react';
import logo from '../media/logo.png';
import * as Const from '../Const';
import ErrorModal from '../component/baseComponent/modal/ErrorModal';
import * as CommonUtils from "../utils/CommonUtils";
import Spinner from '../component/baseComponent/spinner/Spinner';
import $ from "jquery";

import VerticalPanel from "../component/baseComponent/panel/VerticalPanel";
import HorizontalPanel from "../component/baseComponent/panel/HorizontalPanel";

import Label from "../component/baseComponent/field/Label";
import TextField from "../component/baseComponent/field/TextField";
import PasswordField from "../component/baseComponent/field/PasswordField";
import Button from '../component/baseComponent/field/Button'

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            errors: [],
            isLoading: false,
            fields:{
                common:{
                    login:'',
                    password:''
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }

    componentDidMount() {
        window.localStorage.clear();
        if (this.refs.loginField) {
            setTimeout(() => {$('#'+this.refs.loginField.props.id).focus()});
        }
    }

    async doLogin(evt) {
        let errors = [];
        if (!this.state.fields.common.login){errors.push({code:'AUTH_ERROR',message:'Необходимо ввести логин'})}
        if (!this.state.fields.common.password){errors.push({code:'AUTH_ERROR',message:'Необходимо ввести пароль'})}
        if (errors.length > 0) {
            this.setState({errors: errors});
        } else {
            this.setState({isLoading:true});
            let params = this.state.fields;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.AUTH_CONTEXT,'',params,'');
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors:responseData.errors});
            } else {
                CommonUtils.putToLocalStorage("sessionId",responseData.sessionId);
                CommonUtils.putToLocalStorage("userId",responseData.userId);
                CommonUtils.putToLocalStorage("userFio",responseData.userFio);
                CommonUtils.putToLocalStorage("userRole",responseData.userRole);
                CommonUtils.putToLocalStorage("userLogin",responseData.userLogin);
                this.props.mainPageComp.setState({
                    sessionId:responseData.sessionId,
                    userRole:responseData.userRole
                })
            }
        }
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    render() {
        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel-group">
                    <img alt='' src={logo} style={{marginTop:"20px", marginLeft:"30px"}}/>
                    <div className="panel panel-default" style={{width:'400px', marginTop:"20px", marginLeft:"30px"}}>
                        <Spinner isLoading={this.state.isLoading}/>
                        <div className="panel-heading" style={{fontWeight:'bold'}}>Войти в личный кабинет</div>
                        <div className="panel-body">
                            <VerticalPanel>
                                <HorizontalPanel>
                                    <Label value={'Логин'} width={'70px'}/>
                                    <TextField ref={'loginField'} id={CommonUtils.genGuid()} width={'300px'} value={this.state.fields.common.login} onChange={(event) => this.handleChange(event.target.value,'login','common')}/>
                                </HorizontalPanel>
                                <HorizontalPanel>
                                    <Label value={'Пароль'} width={'70px'}/>
                                    <PasswordField width={'300px'} value={this.state.fields.common.password} onChange={(event) => this.handleChange(event.target.value,'password','common')}/>
                                </HorizontalPanel>
                                <HorizontalPanel>
                                    <Label value={''} width={'70px'}/>
                                    <Button style={{marginLeft:'5px'}} value="Войти" onClick={this.doLogin}/>
                                </HorizontalPanel>
                            </VerticalPanel>
                        </div>
                    </div>
                </div>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        );
    }
}

export default LoginPage;