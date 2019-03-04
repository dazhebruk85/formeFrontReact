import React, {Component} from 'react';
import logo from '../media/logo.png';
import QuickActionPanel from '../component/appComponent/mainpage/QuickActionPanel'
import AdminTreeView from "../component/appComponent/mainpage/admin/AdminTreeView";
import UserList from '../component/appComponent/user/UserList';
import UserRoleList from '../component/appComponent/userrole/UserRoleList';
import BasePackageList from '../component/appComponent/basePackage/BasePackageList';
import RoomTypeList from '../component/appComponent/roomtype/RoomTypeList';
import RepairAppList from "../component/appComponent/repairapp/RepairAppList";
import ConfigParamList from "../component/appComponent/configParam/ConfigParamList";
import ChatMainPanel from '../component/appComponent/chat/ChatMainPanel';
import * as Const from "../Const";
import * as CommonUtils from "../utils/CommonUtils";

class AdminPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            choosenTreeItem:'',
            chatWebSocket:''
        }
    }

    componentDidMount() {
        this.setState({chatWebSocket: new WebSocket(Const.CHAT_URL + CommonUtils.getFormLocalStorage('userId'))});
    }

    changeTreeChoice(evt){
        let choosenTreeItem = evt.selectedKeys[0];
        this.setState({choosenTreeItem: choosenTreeItem});
    }

    render() {
        function MainDivComponent(props) {
            switch(props.choosenTreeItem) {
                case 'user':
                    return (
                        <UserList mainPageComp={props.mainPageComp}/>
                    );
                case 'userRole':
                    return (
                        <UserRoleList mainPageComp={props.mainPageComp}/>
                    );
                case 'basePackage':
                    return (
                        <BasePackageList mainPageComp={props.mainPageComp}/>
                    );
                case 'roomType':
                    return (
                        <RoomTypeList mainPageComp={props.mainPageComp}/>
                    );
                case 'repairApp':
                    return (
                        <RepairAppList mainPageComp={props.mainPageComp}/>
                    );
                case 'configParam':
                    return (
                        <ConfigParamList mainPageComp={props.mainPageComp}/>
                    );
                case 'chat':
                    return (
                        <ChatMainPanel mainPageComp={props.mainPageComp} chatWebSocket={props.chatWebSocket}/>
                    );
                case 'notifyTemplates':
                    return (
                        <div>
                            <label className="control-label col-sm-2">Функционал в разарботке</label>
                        </div>
                    );
                case 'notifyMessages':
                    return (
                        <div>
                            <label className="control-label col-sm-2">Функционал в разарботке</label>
                        </div>
                    );
                default:
                    return (
                        null
                    );
            }
        }

        return (
            <div className="panel panel-default" style={{width:'100%',height:'100%',marginBottom:'0px'}}>
                <div className="panel-heading" style={{height:'6%',minHeight:'40px',padding:'0px'}}>
                    <table style={{width:'100%'}}>
                        <tbody>
                            <tr>
                                <td style={{width:'170px'}}>
                                    <img alt='' src={logo} style={{marginTop:"3px", marginLeft:"10px"}}/>
                                </td>
                                <td style={{width:'250px',height:'28px'}}>
                                    <div style={{width:'100%',height:'100%',padding:'0px'}}>
                                    </div>
                                </td>
                                <td>
                                </td>
                                <td style={{width:'120px'}}>
                                    <QuickActionPanel chatWebSocket={this.state.chatWebSocket} mainPageComp={this.props.mainPageComp}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="panel-body" style={{height:'94%',width:'100%',padding:'0px'}}>
                    <table style={{height:'100%',width:'100%'}}>
                        <tbody>
                        <tr>
                            <td style={{verticalAlign:'top'}}>
                                <AdminTreeView changeTreeChoiceAction={this.changeTreeChoice.bind(this)}/>
                            </td>
                            <td style={{width:'100%',verticalAlign:'top'}}>
                                <div ref='mainDataDiv' style={{height:'100%',overflow:'auto'}}>
                                    <MainDivComponent mainPageComp={this.props.mainPageComp} chatWebSocket={this.state.chatWebSocket} choosenTreeItem={this.state.choosenTreeItem}/>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default AdminPage;