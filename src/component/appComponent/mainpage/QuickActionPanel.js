import React, {Component} from 'react';
import exitPng from '../../../media/data/exit.png';
import changePasswordPng from '../../../media/data/changePassword.png';
import changeUserDataPng from '../../../media/data/changeUserData.png';
import taskCalendarPng from '../../../media/data/taskCalendar.png';
import ChangePasswordModal from './ChangePasswordModal';
import UpdateUserDataModal from './UpdateUserDataModal';
import WorkCalendarModal from './WorkCalendarModal';
import OkCancelDialog from '../../../component/baseComponent/modal/OkCancelDialog';
import {Redirect} from "react-router-dom";
import cookie from 'react-cookies';
import * as Const from "../../../Const";
import * as WebSocketUtils from "./../../../utils/WebSocketUtils"

class QuickActionPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            changePasswordModalVisible: false,
            updateUserDataModalVisible: false,
            exitDialogVisible:false,
            workCalendarVisible:false,
            redirectToLoginPage:false
        };

        this.chatSocket = props.chatWebSocket;
        this.showChangePasswordModal = this.showChangePasswordModal.bind(this);
        this.closeChangePasswordModal = this.closeChangePasswordModal.bind(this);
        this.cancelExitDialog = this.cancelExitDialog.bind(this);
        this.okExitDialog = this.okExitDialog.bind(this);
        this.showUpdateUserDataModal = this.showUpdateUserDataModal.bind(this);
        this.closeUpdateUserDataModal = this.closeUpdateUserDataModal.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.chatWebSocket && this.props.chatWebSocket !== prevProps.chatWebSocket ) {
            this.chatSocket = this.props.chatWebSocket;
        }
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

    cancelExitDialog(evt){
        this.setState({
            exitDialogVisible: false
        })
    }

    okExitDialog(evt){
        this.setState({
            exitDialogVisible: false,
            redirectToLoginPage:true
        });
        WebSocketUtils.closeWebsocket(this.chatSocket);
    }

    render() {
        const { redirectToLoginPage } = this.state;

        if (redirectToLoginPage) {
            return <Redirect to='/front'/>;
        }

        function addWorkCalendar(comp) {
            const userRole = cookie.load('userRole');
            if (userRole !== Const.CLIENT_ROLE) {
                return (
                    <div style={{width: '100%', height: '100%', padding: '0px', textAlign: '-webkit-center'}}>
                        <img onClick={() => comp.setState({workCalendarVisible: true})}
                             title={'Календарь задач'}
                             alt='Календарь задач'
                             src={taskCalendarPng}
                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px",marginLeft:"0px"}}/>
                    </div>
                );
            } else {
                return(<div></div>)
            }
        }

        return (
            <div style={{width:'100%',height:'100%'}}>
                <table style={{width:'100%'}}>
                    <tbody>
                    <tr>
                        <td>
                            {addWorkCalendar(this)}
                        </td>
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
                                <img onClick={() => this.setState({exitDialogVisible: true})}
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
                                cancelAction={this.cancelExitDialog.bind(this)}
                                okAction={this.okExitDialog.bind(this)}>
                    <div>Вы действительно хотите выйти?</div>
                </OkCancelDialog>
                <WorkCalendarModal visible={this.state.workCalendarVisible} closeAction={() => this.setState({workCalendarVisible: false})}/>
            </div>
        )
    }
}

export default QuickActionPanel;