import React, {Component} from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import * as Const from "../../../Const";
import cookie from "react-cookies";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import './../../../media/chat/chat.css';
import Field from "../../baseComponent/field/Field";
import $ from "jquery";
import * as DateUtils from '../../../utils/DateUtils';

import chatUserPng from "../../../media/chat/chatUser.png";
import chatSendMessagePng from "../../../media/chat/chatSendMessage.png";
import chatAddFilePng from "../../../media/chat/chatAddFile.png";
import userOnlinePng from "../../../media/chat/online.png";
import userOfflinePng from "../../../media/chat/offline.png";

class ChatMainPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            selectedUser:{},
            users:{},
            fields:{
                common:{
                    message:''
                }
            },
            messages: new Map(),
            noNeedField:''
        };

        this.chatSocket = new WebSocket(Const.CHAT_URL + cookie.load('userId'));
        this.chatSocket.onmessage = this.handleChatMessage.bind(this);
        this.sendMessageToChat = this.sendMessageToChat.bind(this);

        this.getChatUsers = this.getChatUsers.bind(this);
        this.handleSelectChatUser = this.handleSelectChatUser.bind(this);
    }

    componentDidMount() {
        if (CommonUtils.objectIsEmpty(this.state.users)) {
            this.getChatUsers()
        }

        this.chatSocket.onopen = function() {
            console.log("Соединение установлено.");
        };

        this.chatSocket.onclose = function(event) {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения'); // например, "убит" процесс сервера
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        this.chatSocket.onerror = function(error) {
            console.log("Ошибка " + error.message);
        };

    }

    componentDidUpdate(prevProps) {
    }

    async getChatUsers() {
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHAT_CONTEXT,Const.GET_USERS_ACTION,{},cookie.load('sessionId'));
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                users: responseData.params.users
            });

            let userMap = new Map();
            for (let paramUserIndex in responseData.params.users) {
                let user = responseData.params.users[paramUserIndex];
                userMap[user.entityId] = user.chatState;
            }
            setTimeout(() =>
                    this.chatSocket.send(JSON.stringify({allChatUsers:userMap,fromUser:cookie.load('userId'),toUser:cookie.load('userId'),type:Const.CHAT_USER_STATE}))
                ,0);
        }
    }

    handleSelectChatUser = (event) => {
        let selectedChatUserID =  event.currentTarget.getAttribute('chatuserid');
        let selectedItem = this.state.users[selectedChatUserID];
        if (!CommonUtils.objectIsEmpty(selectedItem)) {
            this.setState({
                selectedUser: selectedItem,
                fields:{
                    ...this.state.fields,
                    common:{
                        ...this.state.fields.common,
                        message:''
                    }
                }
            });
        }
        setTimeout(() =>
            this.chatSocket.send(JSON.stringify({fromUser:cookie.load('userId'),toUser:this.state.selectedUser.entityId,type:Const.CHAT_USER_HISTORY,pageNumber:selectedItem.dialogPage}))
            ,0);
    };

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    handleChatMessage(event) {
        let messageData = JSON.parse(event.data);

        if (Const.CHAT_MESSAGE_TEXT_TYPE === messageData.type) {
            let messageObject = {content:messageData.content,sendDate:messageData.sendDate,fromMe:false};
            if (this.state.messages.get(messageData.fromUser)) {
                this.state.messages.get(messageData.fromUser).push(messageObject);
            } else {
                let messageArr = [];
                messageArr.push(messageObject);
                this.state.messages.set(messageData.fromUser, messageArr);
            }
        } else if (Const.CHAT_USER_HISTORY === messageData.type) {
            let messageArr = [];
            for (let mesIndex in messageData.chatMessageList) {
                let chatMessage=messageData.chatMessageList[mesIndex];
                let forMe = chatMessage.fromUser === cookie.load('userId');
                let historyMessageObject = {content:chatMessage.content,sendDate:chatMessage.sendDate,fromMe:forMe};
                messageArr.push(historyMessageObject);
            }
            this.state.messages.set(messageData.toUser, messageArr);
        } else if (Const.CHAT_USER_STATE === messageData.type) {
            for (let key in messageData.userStateMap) {
                //TODO прикрутить обработку статусов пользователей (в сети, не в сети)
                this.setState({
                    users:{
                        ...this.state.users,
                        [key]:{
                            ...this.state.users[key],
                            chatState:messageData.userStateMap[key]
                        }
                    }
                })
            }
        }
        this.setState({
            noNeedField:''
        });
        this.scrollChatDialogDivToBottom();
    }

    sendMessageToChat() {
        if (this.state.fields.common.message && !CommonUtils.objectIsEmpty(this.state.selectedUser)) {
            this.chatSocket.send(JSON.stringify({toUser:this.state.selectedUser.entityId,content:this.state.fields.common.message,type:Const.CHAT_MESSAGE_TEXT_TYPE}));

            let messageObject = {content:this.state.fields.common.message,sendDate:new Date(),fromMe:true};
            if (this.state.messages.get(this.state.selectedUser.entityId)) {
                this.state.messages.get(this.state.selectedUser.entityId).push(messageObject);
            } else {
                let messageArr = [];
                messageArr.push(messageObject);
                this.state.messages.set(this.state.selectedUser.entityId, messageArr);
            }

            this.setState({
                fields:{
                    ...this.state.fields,
                    common:{
                        ...this.state.fields.common,
                        message:''
                    }
                }
            });
        }
        this.scrollChatDialogDivToBottom()
    }

    scrollChatDialogDivToBottom() {
        if (this.refs.chatDialogDiv) {
            setTimeout(() => $('.chatDialogDiv').animate({scrollTop:$('.chatDialogDiv').prop("scrollHeight")},1000),0);
        }
    }

    render() {

        let selectedUserId = this.state.selectedUser.entityId;

        function addMessage(messageItem) {
            return(
                <tr key={CommonUtils.genGuid()}>
                    <td key={CommonUtils.genGuid()} style={{width:'100%'}}>
                        <div className={messageItem.fromMe ? 'myMessage' : 'alienMessage'} key={CommonUtils.genGuid()}>
                            <div key={CommonUtils.genGuid()}>{messageItem.content}</div>
                            <div className={'messageSendTimeDiv'} key={CommonUtils.genGuid()}>Отправлено: {DateUtils.dateToStringWithTime(messageItem.sendDate)}</div>
                            <div style={{paddingTop:'2px'}} className={'messageSendTimeDiv'} key={CommonUtils.genGuid()}>Прочитано: {DateUtils.dateToStringWithTime(new Date())}</div>
                        </div>
                    </td>
                </tr>
            )
        }

        function getCurrentUserMessage(state) {
            if (state.messages.get(state.selectedUser.entityId)) {
                let messageArr = state.messages.get(state.selectedUser.entityId);
                return (
                        messageArr.map((messageItem, messageIndex) => (
                            addMessage(messageItem)
                        ))
                )
            } else {
                return (null);
            }
        }

        return (
            <div style={{height:'100%',width:'100%'}}>
                <div className={'chatUserListDiv'}>
                    <table style={{width:'100%'}}>
                        <tbody>
                        {CommonUtils.objectToPropArr(this.state.users).map((item) => (
                            <tr key={'userChatTd'+item.key}>
                                <td key={'userChatTd'+item.key}>
                                    <div className={item.key === selectedUserId ? 'chatDivUserSelected' : 'chatDivUser'} chatuserid={item.key} onClick={this.handleSelectChatUser}>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <img alt={''} title={item.value.chatState === Const.ONLINE_STATE ? 'В сети' : 'Не в сети'} className={'userStateImg'} src={item.value.chatState === Const.ONLINE_STATE ? userOnlinePng : userOfflinePng}/>
                                                    <img alt={''} className={'userImg'} src={chatUserPng}/>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div>{item.value.fio}</div>
                                                        <div>{item.value.userRole}</div>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={'chatMessagesDiv'}>
                    <div ref={'chatDialogDiv'} className={'chatDialogDiv'} id={CommonUtils.genGuid()}>
                        <table style={{width:'100%'}}>
                            <tbody>
                                {getCurrentUserMessage(this.state)}
                            </tbody>
                        </table>
                    </div>
                    <div className={'chatMessageSendDiv'}>
                        <table style={{height:'100%',width:'100%',marginRight:'5px'}}>
                            <tbody>
                                <tr>
                                    <td style={{height:'100%',verticalAlign:'top'}}>
                                        <Field placeholder={'Введите сообщение'} formStyle={{marginRight:'0px',width:'100%'}} fieldWidth='100%' style={{resize:'none',height:'70px'}} maxLength={1000} type={Const.TEXTAREA} value={this.state.fields.common.message} onChange={(event) => this.handleChange(event.target.value,'message','common')}/>
                                    </td>
                                    <td style={{height:'100%',verticalAlign:'top',textAlign:'center',width:'40px'}}>
                                        <img onClick={() => this.sendMessageToChat()} title={'Отправить сообщение'} alt='' src={chatSendMessagePng} style={{height:"32px",width:"32px",cursor:'pointer'}}/>
                                    </td>
                                    <td style={{height:'100%',verticalAlign:'top',textAlign:'center',width:'40px'}}>
                                        <img title={'Прикрепить файл'} alt='' src={chatAddFilePng} style={{height:"32px",width:"32px",cursor:'pointer'}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }

}

export default ChatMainPanel