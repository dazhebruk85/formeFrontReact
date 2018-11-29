import React, {Component} from 'react';
import logo from '../../media/logo.png';
import exitPng from '../../media/data/exit.png';
import changePasswordPng from '../../media/data/changePassword.png';
import changeUserDataPng from '../../media/data/changeUserData.png';

class AdminPage extends Component {

    constructor() {
        super();
    }



    render() {
        return (
            <div className="container" style={{width:'100%',height:'100%'}}>
                <div className="panel panel-default" style={{width:'99%',height:'98%',margin:"10px"}}>
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
                                                            <img title={'Сменить пароль'} alt='Сменить пароль' src={changePasswordPng} style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                                            <img title={'Выход'} alt='Выход' src={exitPng} style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}/>
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
            </div>
        )
    }
}

export default AdminPage;