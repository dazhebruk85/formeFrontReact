import React, {Component} from 'react';
import logo from '../../media/logo.png';
import QuickActionPanel from '../../component/appComponent/mainpage/QuickActionPanel'
import AdminTreeView from "../../component/appComponent/mainpage/admin/AdminTreeView";
import UserList from '../../component/appComponent/user/UserList';
import UserRoleList from '../../component/appComponent/userrole/UserRoleList';
import BasePackageList from '../../component/appComponent/basePackage/BasePackageList';
import RoomTypeList from '../../component/appComponent/roomtype/RoomTypeList';
import RepairAppList from "../../component/appComponent/repairapp/RepairAppList";
import ConfigParamList from "../../component/appComponent/configParam/ConfigParamList";
import ChatMainPanel from '../../component/appComponent/chat/ChatMainPanel';

class AdminPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            choosenTreeItem:''
        }
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
                        <UserList/>
                    );
                case 'userRole':
                    return (
                        <UserRoleList/>
                    );
                case 'basePackage':
                    return (
                        <BasePackageList/>
                    );
                case 'roomType':
                    return (
                        <RoomTypeList/>
                    );
                case 'repairApp':
                    return (
                        <RepairAppList/>
                    );
                case 'configParam':
                    return (
                        <ConfigParamList/>
                    );
                case 'chat':
                    return (
                        <ChatMainPanel/>
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
            <div style={{width:'100%',height:'100%'}}>
                <div className="panel panel-default" style={{width:'100%',height:'100%',marginBottom:'0px',marginTop:"5px",marginLeft:"5px",marginRight:"5px"}}>
                    <div className="panel-heading" style={{height:'40px'}}>
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
                                        <QuickActionPanel/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{height:'95%',width:'100%'}}>
                        <table style={{height:'98%',width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{verticalAlign:'top'}}>
                                    <AdminTreeView changeTreeChoiceAction={this.changeTreeChoice.bind(this)}/>
                                </td>
                                <td style={{width:'100%',verticalAlign:'top'}}>
                                    <div ref='mainDataDiv' style={{height:'100%',overflow:'auto'}}>
                                        <MainDivComponent choosenTreeItem={this.state.choosenTreeItem}/>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminPage;