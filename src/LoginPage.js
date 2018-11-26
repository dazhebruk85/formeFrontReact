import React, {Component} from 'react';
import logo from '../src/logo.png';

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            error: '',
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    componentDidMount() {
    }

    dismissError() {
        this.setState({ error: '' });
    }

    doLogin(evt) {
        if (!this.state.username) {
            return this.setState({ error: 'Username is required' });
        }

        if (!this.state.password) {
            return this.setState({ error: 'Password is required' });
        }
        return this.setState({ error: '' });
    }

    handleUserChange(evt) {
        this.setState({
            username: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }


    render() {
        // NOTE: I use data-attributes for easier E2E testing
        // but you don't need to target those (any css-selector will work)

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
                                        <input id="loginTextbox" className="form-control" type="text" value={this.state.username} onChange={this.handleUserChange} placeholder="Введите логин"/>
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
            </div>
        );
    }
}

export default LoginPage;
