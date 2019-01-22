import React, {Component} from 'react';
import logo from '../../media/logo.png';
import * as Const from '../../Const';
import cookie from 'react-cookies';
import ErrorModal from '../../component/baseComponent/modal/ErrorModal';
import Field from '../../component/baseComponent/field/Field'
import Button from '../../component/baseComponent/field/Button'
import * as CommonUtils from "../../utils/CommonUtils";
import Spinner from '../../component/baseComponent/spinner/Spinner';

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
        let cookieLet = cookie;
        let cookieMap = Object.entries(cookieLet.loadAll(true)).map(([key, value]) => ({key,value}))
        cookieMap.forEach(function(element) {
            cookieLet.remove(element.key, { path: '/' });
        });

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
                cookie.save('sessionId',responseData.sessionId,{path:'/'});
                cookie.save('userId',responseData.userId,{path:'/'});
                cookie.save('userFio',responseData.userFio,{path:'/'});
                cookie.save('userRole',responseData.userRole,{path:'/'});

                if (responseData.userRole === Const.CLIENT_ROLE) {
                    this.props.history.push('/clientPage')
                } else {
                    this.props.history.push('/adminPage')
                }
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
                        <div className="panel-heading">Войти в личный кабинет</div>
                        <div className="panel-body">
                            <form className="form-horizontal">
                                <Field labelWidth='70px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} value={this.state.fields.common.login} onChange={(event) => this.handleChange(event.target.value,'login','common')} maxLength={50}/>
                                <Field labelWidth='70px' fieldWidth='300px' label='Пароль' type={Const.PASSWORD} value={this.state.fields.common.password} onChange={(event) => this.handleChange(event.target.value,'password','common')} maxLength={50}/>
                                <div className="form-group" style={{marginBottom:'0px'}}>
                                    <label style={{width:'70px'}} className="control-label col-sm-2"></label>
                                    <Button style={{marginLeft:'5px'}} value="Войти" onClick={this.doLogin}/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        );
    }
}

export default LoginPage;