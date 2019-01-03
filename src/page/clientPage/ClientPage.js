import React, {Component} from 'react';
import logo from '../../media/logo.png';
import QuickActionPanel from '../../component/appComponent/mainpage/QuickActionPanel'
import cookie from 'react-cookies';
import ClientTreeView from '../../component/appComponent/mainpage/client/ClientTreeView'
import RepairAppList from '../../component/appComponent/repairapp/RepairAppList';

class ClientPage extends Component {

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
                case 'repairApp':
                    return (
                        <RepairAppList/>
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
                    <div className="panel-heading" style={{height:'40px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'170px'}}>
                                    <img alt='' src={logo} style={{marginTop:"0px", marginLeft:"0px"}}/>
                                </td>
                                <td style={{width:'500px',height:'28px'}}>
                                    <div style={{width:'100%',height:'100%',padding:'0px'}}>
                                        <label style={{height:'28px',width:'100%',marginBottom:'0px', paddingTop:'6px',fontSize:'large'}} className="control-label col-sm-2" htmlFor="loginTextbox">Здравствуйте {cookie.load('userFio')}</label>
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
                                    <ClientTreeView changeTreeChoiceAction={this.changeTreeChoice.bind(this)}/>
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

export default ClientPage;