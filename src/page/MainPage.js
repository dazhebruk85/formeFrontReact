import {Component} from "react";
import * as CommonUtils from "../utils/CommonUtils";
import * as Const from "../Const";
import React from "react";
import LoginPage from "./LoginPage";
import ClientPage from "./ClientPage";
import AdminPage from "./AdminPage";

class MainPage extends Component {

    constructor() {
        super();
        this.state = {
            errors:[],
            sessionId: CommonUtils.getFormLocalStorage('sessionId'),
            userRole: CommonUtils.getFormLocalStorage('userRole')
        };
    }

    render() {
        let enterPoint = 'loginPage';
        if (this.state.sessionId && this.state.userRole) {
            if (this.state.userRole !== Const.CLIENT_ROLE) {
                enterPoint = 'adminPage';
            } else {
                enterPoint = 'clientPage';
            }
        } else {
            enterPoint = 'loginPage'
        }

        function PageComponent(props) {
            switch(enterPoint) {
                case 'loginPage':
                    return (
                        <LoginPage mainPageComp={props.mainPageComp}/>
                    );
                case 'clientPage':
                    return (
                        <ClientPage mainPageComp={props.mainPageComp}/>
                    );
                case 'adminPage' :
                    return (
                        <AdminPage mainPageComp={props.mainPageComp}/>
                    );
                default:
                    return (
                        null
                    );
            }
        }

        return (
            <div style={{width:'100%',height:'100%'}}>
                <PageComponent mainPageComp={this}/>
            </div>

        )
    }
}

export default MainPage;