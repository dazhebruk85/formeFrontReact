import React, {Component} from 'react';
import exitPng from '../../media/data/exit.png';
import changePasswordPng from '../../media/data/changePassword.png';
import changeUserDataPng from '../../media/data/changeUserData.png';
import ChangePasswordModal from './ChangePasswordModal';
import UpdateUserDataModal from './UpdateUserDataModal';
import OkCancelDialog from '../../components/modal/OkCancelDialog';
import {Redirect} from "react-router-dom";

class QuickActionPanel extends Component {

    constructor() {
        super();
        this.state = {
            changePasswordModalVisible: false,
            updateUserDataModalVisible: false,
            exitDialogVisible:false,
            redirectToLoginPage:false
        };

        this.showChangePasswordModal = this.showChangePasswordModal.bind(this);
        this.closeChangePasswordModal = this.closeChangePasswordModal.bind(this);
        this.showExitDialog = this.showExitDialog.bind(this);
        this.cancelExitDialog = this.cancelExitDialog.bind(this);
        this.okExitDialog = this.okExitDialog.bind(this);
        this.showUpdateUserDataModal = this.showUpdateUserDataModal.bind(this);
        this.closeUpdateUserDataModal = this.closeUpdateUserDataModal.bind(this);
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

    showUpdateUserDataModal(evt){
        this.setState({
            updateUserDataModalVisible: true
        })
    }

    closeUpdateUserDataModal(evt){
        this.setState({
            updateUserDataModalVisible: false
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

        if (redirectToLoginPage) {
            return <Redirect to='/front'/>;
        }

        return (
            <div style={{width:'100%',height:'100%'}}>
                <table style={{width:'100%'}}>
                    <tbody>
                    <tr>
                        <td>
                            <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                <img onClick={this.showUpdateUserDataModal}
                                     title={'Изменить настройки пользователя'}
                                     alt='Изменить настройки пользователя'
                                     src={changeUserDataPng}
                                     style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
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
                <UpdateUserDataModal visible={this.state.updateUserDataModalVisible} closeAction={this.closeUpdateUserDataModal.bind(this)}/>
                <ChangePasswordModal visible={this.state.changePasswordModalVisible} closeAction={this.closeChangePasswordModal.bind(this)}/>
                <OkCancelDialog okCancelVisible={this.state.exitDialogVisible}
                                question={'Вы действительно хотите выйти?'}
                                cancelAction={this.cancelExitDialog.bind(this)}
                                okAction={this.okExitDialog.bind(this)}/>
            </div>
        )
    }
}

export default QuickActionPanel;