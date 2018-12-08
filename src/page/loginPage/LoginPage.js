import React, {Component} from 'react';
import logo from '../../media/logo.png';
import * as Const from '../../Const';
import cookie from 'react-cookies';
import ErrorModal from '../../components/modal/ErrorModal';
import UniversalField from './../../components/field/UniversalField'
import Button from './../../components/field/Button'
import * as CommonUtils from "../../utils/CommonUtils";
import spinner from '../../media/spinner.svg';

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            login: '',
            password: '',
            errors: [],
            isLoading: false
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
        if (!this.state.login) {
            errors.push({code:'AUTH_ERROR',message:'Необходимо ввести логин'})
        }
        if (!this.state.password) {
            errors.push({code:'AUTH_ERROR',message:'Необходимо ввести пароль'})
        }
        if (errors.length > 0) {
            this.setState({errors: errors});
        } else {
            this.setState({isLoading:true});
            let params = {login: this.state.login,password: this.state.password};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.AUTH_CONTEXT,'',params,'');
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                cookie.save('sessionId', responseData.sessionId, { path: '/' });
                cookie.save('userId', responseData.userId, { path: '/' });
                cookie.save('userFio', responseData.userFio, { path: '/' });
                cookie.save('userRole', responseData.userRole, { path: '/' });

                if (responseData.userRole === Const.CLIENT_ROLE) {
                    this.props.history.push('/clientPage')
                } else {
                    this.props.history.push('/adminPage')
                }
            }
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
                    <div id='loginFramePanel' ref='loginFramePanel' className="panel panel-default" style={{width:'400px', height:'220px', marginTop:"20px", marginLeft:"30px"}}>
                        <div id='loadingDiv' style={{visibility:this.state.isLoading ? 'visible':'hidden',borderRadius:'3px',background:'black',opacity:'0.4',position:'fixed',width:'inherit',height:'inherit',zIndex:'5'}}>
                            <img alt='' src={spinner} style={{position:'absolute',top:'25%',left:'40%'}}/>
                        </div>
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