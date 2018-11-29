import React, {Component} from 'react';
import logo from '../../media/logo.png';
import axios from 'axios';
import * as Const from '../../Const';
import cookie from 'react-cookies';
import MultiPopup from '../../components/modal/MultiPopup';

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

    clearErrors() {
        this.setState({
            errors: []
        });
    }

    doLogin(evt) {
        if (!this.state.login) {
            this.setErrors([{code:'AUTH_ERROR',message:'Необходимо ввести логин'}])
            return;
        }

        if (!this.state.password) {
            this.setErrors([{code:'AUTH_ERROR',message:'Необходимо ввести пароль'}])
            return;
        }

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
                                <div className="form-group">
                                    <label className="control-label col-sm-2" htmlFor="loginTextbox">Логин</label>
                                    <div className="col-sm-10">
                                        <input id="login" className="form-control" type="text" value={this.state.login} onChange={this.handleChange} placeholder="Введите логин"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2" htmlFor="passwordTextbox">Пароль</label>
                                    <div className="col-sm-10">
                                        <input id="password" className="form-control" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Введите пароль"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2" htmlFor="loginButton"></label>
                                    <div className="col-sm-10">
                                        <input id="loginButton" type="button" value="Войти" className="btn btn-primary" onClick={this.doLogin}/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <MultiPopup popupData={this.state.errors}
                            popupType={Const.ERROR_POPUP}
                            closeAction={this.clearErrors.bind(this)}/>
            </div>
        );
    }
}

export default LoginPage;
