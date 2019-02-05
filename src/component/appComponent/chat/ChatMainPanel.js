import React, {Component} from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import * as Const from "../../../Const";
import cookie from "react-cookies";
import ErrorModal from "../repairapp/RepairAppEditForm";
import * as DateUtils from "../../../utils/DateUtils";

class ChatMainPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedUser:{},
            users:{}
        };

        this.getChatUsers = this.getChatUsers.bind(this);
    }

    componentDidMount() {
        if (CommonUtils.objectIsEmpty(this.state.users)) {
            this.getChatUsers()
        }
    }

    async getChatUsers() {
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHAT_CONTEXT,Const.GET_USERS_ACTION,{},cookie.load('sessionId'));
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                users: responseData.params.users
            });
        }
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                    {CommonUtils.objectToPropArr(this.state.users).map((item) => (
                                        <tr>
                                            <td className={'tdUser'} key={'userTd'+item.entityId}>
                                                <div className={'divWeekHeaderDay'}>{item.rusShortName}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </td>
                            <td>Собственно чат</td>
                        </tr>
                    </tbody>
                </table>

                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }

}

export default ChatMainPanel