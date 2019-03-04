import React, {Component} from 'react';
import logo from '../media/logo.png';
import * as Const from '../Const';
import ErrorModal from '../component/baseComponent/modal/ErrorModal';
import * as CommonUtils from "../utils/CommonUtils";
import Spinner from '../component/baseComponent/spinner/Spinner';
import $ from "jquery";
import ClientJs from 'clientjs'

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
            client:{},
            errors:[],
            isLoading:false,
            fields:{
                login:'',
                password:''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }

    componentDidMount() {
        let clientInfo = new ClientJs().getResult();
        clientInfo.screenWidth = window.screen.width;
        clientInfo.screenHeight = window.screen.height;
        this.setState({client:clientInfo});
        window.localStorage.clear();
        if (this.refs.loginField) {
            setTimeout(() => {$('#'+this.refs.loginField.props.id).focus()});
        }
    }

    async doLogin(evt) {
        this.setState({isLoading:true});
        let params = this.state.fields;
        params.clientDeviceInfo = this.state.client;
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.AUTH_CONTEXT,'',params,'');
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors:responseData.errors});
        } else {
            CommonUtils.putToLocalStorage("sessionId",responseData.params.sessionId);
            CommonUtils.putToLocalStorage("userId",responseData.params.userId);
            CommonUtils.putToLocalStorage("userFio",responseData.params.userFio);
            CommonUtils.putToLocalStorage("userRole",responseData.params.userRole);
            CommonUtils.putToLocalStorage("userLogin",responseData.params.userLogin);
            this.props.mainPageComp.setState({
                sessionId:responseData.params.sessionId,
                userRole:responseData.params.userRole
            })
        }
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    render() {
        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel-group">
                    <img alt='' src={logo} style={{marginTop:"20px"}}/>
                    <div className="panel panel-default" style={{width:'330px', marginTop:"20px"}}>
                        <Spinner isLoading={this.state.isLoading}/>
                        <div className="panel-heading" style={{fontWeight:'bold'}}>Войти в личный кабинет</div>
                        <VerticalPanel style={{marginTop:"5px"}}>
                            <HorizontalPanel>
                                <Label value={'Логин'} width={'70px'}/>
                                <TextField ref={'loginField'} id={CommonUtils.genGuid()} width={'230px'} value={this.state.fields.login} onChange={(event) => this.handleChange(event.target.value,'login','')}/>
                            </HorizontalPanel>
                            <HorizontalPanel>
                                <Label value={'Пароль'} width={'70px'}/>
                                <PasswordField width={'230px'} value={this.state.fields.password} onChange={(event) => this.handleChange(event.target.value,'password','')}/>
                            </HorizontalPanel>
                            <HorizontalPanel>
                                <Label value={''} width={'70px'}/>
                                <Button style={{marginLeft:'5px'}} value="Войти" onClick={this.doLogin}/>
                            </HorizontalPanel>
                        </VerticalPanel>
                    </div>
                </div>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        );
    }
}

export default LoginPage;