import React, {Component} from 'react';
import logo from '../../media/logo.png';
import QuickActionPanel from '../../components/user/QuickActionPanel'
import cookie from 'react-cookies';
import ClientTreeView from '../../components/user/client/ClientTreeView'

class ClientPage extends Component {

    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {
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
                    <ClientTreeView/>
                 </div>
            </div>
        )
    }
}

export default ClientPage;