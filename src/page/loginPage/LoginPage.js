import React, {Component} from 'react';
import logo from '../../media/logo.png';
import axios from 'axios';
import * as Const from '../../Const';
import cookie from 'react-cookies';
import ErrorModal from '../../components/modal/ErrorModal';
import UniversalField from './../../components/field/UniversalField'
import Button from './../../components/field/Button'

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            login: '',
            password: '',
            errors: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.setErrors = this.setErrors.bind(this);
    }

    componentDidMount() {
        let cookieLet = cookie;
        let cookieMap = Object.entries(cookieLet.loadAll(true)).map(([key, value]) => ({key,value}))
        cookieMap.forEach(function(element) {
            cookieLet.remove(element.key, { path: '/' });
        });

    }

    setErrors(errors) {
        this.setState({
            errors: errors
        });
    }

    doLogin(evt) {
        let errors = [];
        if (!this.state.login) {
            errors.push({code:'AUTH_ERROR',message:'Необходимо ввести логин'})
        }
        if (!this.state.password) {
            errors.push({code:'AUTH_ERROR',message:'Необходимо ввести пароль'})
        }
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            let loginPostEvent = axios.post(Const.APP_URL, {
                context: Const.AUTH_CONTEXT,
                action:'',
                params: {
                    login: this.state.login,
                    password: this.state.password
                }
            });
            loginPostEvent.then(res => {
                if (res.data.errors.length > 0) {
                    this.setErrors(res.data.errors)
                } else {
                    cookie.save('sessionId', res.data.sessionId, { path: '/' });
                    cookie.save('userId', res.data.userId, { path: '/' });
                    cookie.save('userFio', res.data.userFio, { path: '/' });
                    cookie.save('userRole', res.data.userRole, { path: '/' });

                    if (res.data.userRole === Const.CLIENT_ROLE) {
                        this.props.history.push('/clientPage')
                    } else {
                        this.props.history.push('/adminPage')
                    }
                }
            });
            loginPostEvent.catch(error => {
                if (!error.status) {
                    this.setErrors([{code:'SYS',message:'APP сервер недоступен'}])
                } else {
                    this.setErrors([{code:'SYS',message:'Непредвиденная ошибка на сервере'}])
                }
            });
        }
    }

    handleChange(event) {
        const value = event.target.value;
        const id = event.target.id;

        this.setState({
            [id]: value
        });
    }


    render() {
        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel-group">
                    <img alt='' src={logo} style={{marginTop:"20px", marginLeft:"30px"}}/>
                    <div className="panel panel-default" style={{width:'400px', marginTop:"20px", marginLeft:"30px"}}>
                        <div className="panel-heading">Войти в личный кабинет</div>
                        <div className="panel-body">
                            <form className="form-horizontal">
                                <UniversalField labelWidth='70px' fieldWidth='300px' label='Логин' type={Const.TEXTFIELD} id='login' value={this.state.login} onChange={this.handleChange} maxLength={50}/>
                                <UniversalField labelWidth='70px' fieldWidth='300px' label='Пароль' type={Const.PASSWORD} id='password' value={this.state.password} onChange={this.handleChange} maxLength={50}/>
                                <div className="form-group">
                                    <label style={{width:'70px'}} className="control-label col-sm-2"></label>
                                    <Button style={{marginLeft:'15px'}} id="LPloginButton" value="Войти" onClick={this.doLogin}/>
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
