import React, {Component} from 'react';
import logo from '../../media/logo.png';
import axios from 'axios';
import * as Const from '../../Const';
import cookie from 'react-cookies';
import ErrorModal from '../../components/modal/error/ErrorModal';

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            login: '',
            password: '',
            errors: []
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }

    componentDidMount() {
        let cookieLet = cookie;
        let cookieMap = Object.entries(cookieLet.loadAll(true)).map(([key, value]) => ({key,value}))
        cookieMap.forEach(function(element) {
            cookieLet.remove(element.key, { path: '/' });
        });

    }

    doLogin(evt) {
        if (!this.state.login) {
            this.setState({
                errors: [{code:'AUTH_ERROR',message:'Необходимо ввести логин'}]
            });
            return;
        }

        if (!this.state.password) {
            this.setState({
                errors: [{code:'AUTH_ERROR',message:'Необходимо ввести пароль'}]
            });
        }

        axios.post(Const.APP_URL, {
            entity:'',
            context: Const.AUTH_CONTEXT,
            params: {
                login: this.state.login,
                password: this.state.password
            }
        }).then(res => {
            if (res.data.errors.length > 0) {
                this.setState({ errors: res.data.errors});
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
        })
    }

    handleUserChange(evt) {
        this.setState({
            login: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }


    render() {
        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel-group">
                    <img src={logo} style={{marginTop:"20px", marginLeft:"30px"}}/>
                    <div className="panel panel-default" style={{width:'400px', marginTop:"20px", marginLeft:"30px"}}>
                        <div className="panel-heading">Войти в личный кабинет</div>
                        <div className="panel-body">
                            <form className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-2" htmlFor="loginTextbox">Логин</label>
                                    <div className="col-sm-10">
                                        <input id="loginTextbox" className="form-control" type="text" value={this.state.login} onChange={this.handleUserChange} placeholder="Введите логин"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-2" htmlFor="passwordTextbox">Пароль</label>
                                    <div className="col-sm-10">
                                        <input id="passwordTextbox" className="form-control" type="password" value={this.state.password} onChange={this.handlePassChange} placeholder="Введите пароль"/>
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

                <ErrorModal errors={this.state.errors}/>

            </div>
        );
    }
}

export default LoginPage;
