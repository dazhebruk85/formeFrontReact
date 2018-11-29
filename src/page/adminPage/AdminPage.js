import React, {Component} from 'react';
import logo from '../../media/logo.png';
import exitPng from '../../media/data/exit.png';
import spinnerSvg from '../../media/spinner.svg';
import changePasswordPng from '../../media/data/changePassword.png';
import changeUserDataPng from '../../media/data/changeUserData.png';
import ChangePasswordModal from '../../components/modal/user/ChangePasswordModal';
import OkCancelDialog from '../../components/modal/OkCancelDialog';
import {Redirect} from "react-router-dom";


class AdminPage extends Component {

    constructor() {
        super();
        this.state = {
            isLoading:true,
            changePasswordModalVisible: false,
            exitDialogVisible:false,
            redirectToLoginPage:false
        };

        this.showChangePasswordModal = this.showChangePasswordModal.bind(this);
        this.closeChangePasswordModal = this.closeChangePasswordModal.bind(this);
        this.showExitDialog = this.showExitDialog.bind(this);
        this.cancelExitDialog = this.cancelExitDialog.bind(this);
        this.okExitDialog = this.okExitDialog.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ isLoading: false }), 1000);
    }

    showChangePasswordModal(evt){
        this.setState({
            changePasswordModalVisible: true
        })
    }

    closeChangePasswordModal(evt){
        this.setState({
            changePasswordModalVisible: false
        })
    }

    showExitDialog(evt){
        this.setState({
            exitDialogVisible: true
        })
    }

    cancelExitDialog(evt){
        this.setState({
            exitDialogVisible: false
        })
    }

    okExitDialog(evt){
        this.setState({
            exitDialogVisible: false,
            redirectToLoginPage:true
        })
    }

    render() {
        const { redirectToLoginPage } = this.state;
        const { isLoading } = this.state;

        if (redirectToLoginPage) {
            return <Redirect to='/front'/>;
        }

        if (isLoading) {
            return <img alt='' src={spinnerSvg} style={{position:'fixed',top:'30%',left:'45%'}}/>
        }

        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel panel-default" style={{width:'99%',height:'97%',margin:"10px"}}>
                    <div className="panel-heading" style={{height:'50px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <td style={{width:'170px'}}>
                                        <img alt='' src={logo} style={{marginTop:"0px", marginLeft:"0px"}}/>
                                    </td>
                                    <td style={{width:'250px',height:'28px'}}>
                                        <div style={{width:'100%',height:'100%',padding:'0px'}}>
                                            <label style={{height:'28px',width:'100%',marginBottom:'0px', paddingTop:'6px',fontSize:'large'}} className="control-label col-sm-2" htmlFor="loginTextbox">Панель администратора</label>
                                        </div>
                                    </td>
                                    <td>
                                    </td>
                                    <td style={{width:'120px'}}>
                                        <table style={{width:'100%'}}>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                                            <img title={'Изменить настройки пользователя'} alt='Изменить настройки пользователя' src={changeUserDataPng} style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                                            <img onClick={this.showChangePasswordModal}
                                                                 title={'Сменить пароль'}
                                                                 alt='Сменить пароль'
                                                                 src={changePasswordPng}
                                                                 style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                                            <img onClick={this.showExitDialog}
                                                                 title={'Выход'}
                                                                 alt='Выход'
                                                                 src={exitPng}
                                                                 style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body">

                    </div>
                </div>
                <ChangePasswordModal visible={this.state.changePasswordModalVisible} closeAction={this.closeChangePasswordModal.bind(this)}/>
                <OkCancelDialog okCancelVisible={this.state.exitDialogVisible}
                                question={'Вы действительно хотите выйти?'}
                                cancelAction={this.cancelExitDialog.bind(this)}
                                okAction={this.okExitDialog.bind(this)}/>
            </div>
        )
    }
}

export default AdminPage;