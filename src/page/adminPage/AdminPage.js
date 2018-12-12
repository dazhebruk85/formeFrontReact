import React, {Component} from 'react';
import logo from '../../media/logo.png';
import QuickActionPanel from '../../components/mainpage/QuickActionPanel'
import AdminTreeView from "../../components/mainpage/admin/AdminTreeView";
import UserList from '../../components/user/UserList';
import UserRoleList from '../../components/userrole/UserRoleList';
import BasePackageList from '../../components/basePackage/BasePackageList';

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
                default:
                    return (
                        null
                    );
            }
        }

        return (
            <div style={{width:'100%',height:'100%'}}>
                <div className="panel panel-default" style={{width:'100%',height:'100%',margin:"10px"}}>
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
                                    <div ref='mainDataDiv'>
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