import React, {Component} from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import * as Const from "../../../Const";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import ChatFileUploadModal from "./ChatFileUploadModal";
import './../../../media/chat/chat.css';
import Field from "../../baseComponent/field/Field";
import $ from "jquery";
import * as DateUtils from '../../../utils/DateUtils';
import * as WebSocketUtils from "./../../../utils/WebSocketUtils"
import FileSaver from 'file-saver';
import * as FileUtils from '../../../utils/FileUtils';

import chatUserPng from "../../../media/chat/chatUser.png";
import chatSendMessagePng from "../../../media/chat/chatSendMessage.png";
import chatAddFilePng from "../../../media/chat/chatAddFile.png";
import userOnlinePng from "../../../media/chat/online.png";
import userOfflinePng from "../../../media/chat/offline.png";
import downloadFilePng from "../../../media/fileUpload/downloadFile.png";
import openFileInNewWindowPng from "../../../media/fileUpload/openFileInNewWindow.png";
import newMessageMp3 from "../../../media/chat/chatNewMessage.mp3";
import unreadPng from "../../../media/chat/unread.png";

class ChatMainPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            fileUploadVisible:false,
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

        this.chatSocket = props.chatWebSocket;
        this.chatSocket.onmessage = this.handleChatMessage.bind(this);
        this.sendTextMessageToChat = this.sendTextMessageToChat.bind(this);
        this.fileDialogOpen = this.fileDialogOpen.bind(this);

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

        if (this.refs.chatDialogDiv) {
            $('.chatDialogDiv').scroll(function () {
                if ($('.chatDialogDiv').scrollTop() === 0) {
                    console.log('Scrolled to Page Top');
                }
            });
        }

    }

    componentDidUpdate(prevProps) {
    }

    async getChatUsers() {
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHAT_CONTEXT,Const.GET_USERS_ACTION,{});
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

            setTimeout(() => {
                let currentUserId = CommonUtils.getFormLocalStorage('userId');
                let usersStateMessage = JSON.stringify({allChatUsers:userMap,fromUser:currentUserId,toUser:currentUserId,type:Const.CHAT_USER_STATE});
                WebSocketUtils.sendMesToWebsocket(this.chatSocket, usersStateMessage)
            }
            , 0);
        }
    }

    handleSelectChatUser = async (event) => {
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

        setTimeout( async () => {
            let fromUser = CommonUtils.getFormLocalStorage('userId');
            let toUser = this.state.selectedUser.entityId;
            let params = {fromUserId:fromUser,toUserId:toUser,pageNumber:selectedItem.dialogPage};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.CHAT_CONTEXT,Const.GET_USER_HISTORY_ACTION,params);
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                let messageArr = [];
                for (let mesIndex in responseData.chatMessageList) {
                    let chatMessage = responseData.chatMessageList[mesIndex];
                    let forMe = chatMessage.fromUser === fromUser;
                    let historyMessageObject = {content:chatMessage.content,sendDate:chatMessage.sendDate,readDate:chatMessage.readDate,fromMe:forMe,type:chatMessage.type,fileId:chatMessage.fileId,fileName:chatMessage.fileName,smallImgContent:chatMessage.smallImgContent};
                    messageArr.push(historyMessageObject);
                }
                this.state.messages.set(toUser, messageArr);
                this.setState({
                    users:{
                        ...this.state.users,
                        [this.state.selectedUser.entityId]:{
                            ...this.state.users[this.state.selectedUser.entityId],
                            unread:0
                        }
                    }
                });
                setTimeout(() => this.scrollChatDialogDivToBottom(false),0);
            }
        },0);

    };

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    handleChatMessage(event) {
        let messageData = JSON.parse(event.data);
        let animateScrollDiv = false;
        if ([Const.CHAT_MESSAGE_TEXT_TYPE,Const.CHAT_MESSAGE_FILE_TYPE].includes(messageData.type)) {
            let messageObject = {content:messageData.content,sendDate:messageData.sendDate,readDate:undefined,fromMe:false,type:messageData.type,fileId:messageData.fileId,fileName:messageData.fileName,smallImgContent:messageData.smallImgContent};
            if (this.state.messages.get(messageData.fromUser)) {
                this.state.messages.get(messageData.fromUser).push(messageObject);
            } else {
                let messageArr = [];
                messageArr.push(messageObject);
                this.state.messages.set(messageData.fromUser, messageArr);
            }

            if (messageData.fromUser !== this.state.selectedUser.entityId) {
                let unreadCount = this.state.users[messageData.fromUser].unread;
                this.setState({
                    users:{
                        ...this.state.users,
                        [messageData.fromUser]:{
                            ...this.state.users[messageData.fromUser],
                            unread:unreadCount+1
                        }
                    }
                })
            }

            //Звуковое оповещение
            let audio = new Audio(newMessageMp3);
            audio.play();
            animateScrollDiv = true;
        } else if (Const.CHAT_USER_STATE === messageData.type) {
            for (let key in messageData.chatUserStateMap) {
                if (this.state.users[key]) {
                    this.setState({
                        users:{
                            ...this.state.users,
                            [key]:{
                                ...this.state.users[key],
                                chatState:messageData.chatUserStateMap[key].state,
                                lastWasOnline:messageData.chatUserStateMap[key].lastTimeOnline ? messageData.chatUserStateMap[key].lastTimeOnline : undefined
                            }
                        }
                    })
                }
            }
        }
        this.setState({
            noNeedField:''
        });
        setTimeout(() => this.scrollChatDialogDivToBottom(animateScrollDiv),0);
    }

    async sendFileMessageToChat(fileAndMessageObject) {
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.ATTACH_FILE_CONTEXT,Const.ATTACH_SAVE_FILE,fileAndMessageObject.file);
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            let fileMessage = JSON.stringify({toUser:this.state.selectedUser.entityId,content:fileAndMessageObject.message,fileId:responseData.params.fileId,fileName:responseData.params.fileName,type:Const.CHAT_MESSAGE_FILE_TYPE,smallImgContent:responseData.params.smallImgContent});
            WebSocketUtils.sendMesToWebsocket(this.chatSocket, fileMessage);
            this.addMessageToChatDiv(fileAndMessageObject.message,Const.CHAT_MESSAGE_FILE_TYPE,responseData.params.fileId,responseData.params.fileName,responseData.params.smallImgContent)
        }
        this.setState({fileUploadVisible:false})
    }

    sendTextMessageToChat() {
        if (this.state.fields.common.message && !CommonUtils.objectIsEmpty(this.state.selectedUser)) {
            let textMessage = JSON.stringify({toUser:this.state.selectedUser.entityId,content:this.state.fields.common.message,type:Const.CHAT_MESSAGE_TEXT_TYPE});
            WebSocketUtils.sendMesToWebsocket(this.chatSocket, textMessage);
            this.addMessageToChatDiv(this.state.fields.common.message,Const.CHAT_MESSAGE_TEXT_TYPE,'','','')
        }
    }

    addMessageToChatDiv(content, type, fileId, fileName, smallImgContent) {
        let messageObject = {content:content,sendDate:new Date(),readDate:undefined,fromMe:true,type:type,fileId:fileId,fileName:fileName,smallImgContent:smallImgContent};
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
        this.scrollChatDialogDivToBottom(true)
    }

    fileDialogOpen() {
        if (!CommonUtils.objectIsEmpty(this.state.selectedUser)) {
            this.setState({
                fileUploadVisible:true
            })
        }
    }

    async downloadFile(event) {
        let fileId = event.currentTarget.getAttribute('fileid');
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.ATTACH_FILE_CONTEXT,Const.ATTACH_GET_FILE,{fileId:fileId});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            let fileData = responseData.params;
            let blob = FileUtils.base64ToBlob(fileData.content, fileData.mimeType);
            if (CommonUtils.getBrowserInfo().name !== Const.BROWSER_IE) {
                FileSaver.saveAs(blob,fileData.fileName,fileData.mimeType)
            } else {
                window.navigator.msSaveOrOpenBlob(blob, fileData.fileName);
            }
        }
    }

    async openFileInNewWindow(event) {
        let fileId = event.currentTarget.getAttribute('fileid');
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.ATTACH_FILE_CONTEXT,Const.ATTACH_GET_FILE,{fileId:fileId});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            let fileData = responseData.params;
            let blob = FileUtils.base64ToBlob(fileData.content, fileData.mimeType);
            if (CommonUtils.getBrowserInfo().name !== Const.BROWSER_IE) {
                window.open(URL.createObjectURL(blob));
            } else {
                window.navigator.msSaveOrOpenBlob(blob, fileData.fileName);
            }
        }
    }

    scrollChatDialogDivToBottom(animate) {
        if (this.refs.chatDialogDiv) {
            setTimeout(() => $('.chatDialogDiv').animate({scrollTop:$('.chatDialogDiv').prop("scrollHeight")},500),0);
        }
    }

    render() {

        let selectedUserId = this.state.selectedUser.entityId;

        function addSmallCopyImgIfExist(messageItem) {
            if (messageItem.smallImgContent) {
                return(
                    <img style={{width:'100%',height:'100%'}} alt={''} src={messageItem.smallImgContent}/>
                )
            }
        }

        function addFileDivIfExist(messageItem, page) {
            if (messageItem.type === Const.CHAT_MESSAGE_FILE_TYPE && messageItem.fileId) {
                return(
                    <div>
                        <div className={messageItem.fromMe ? 'myChatFileDownloadDiv' : 'alienChatFileDownloadDiv'}>
                            <img className={'chatActionFileDownloadImg'} fileid={messageItem.fileId} title={'Загрузить файл'} alt={''} src={downloadFilePng} onClick={page.downloadFile.bind(this)}/>
                            <img className={'chatActionFileDownloadImg'} fileid={messageItem.fileId} title={'Открыть файл в новом окне'} alt={''} src={openFileInNewWindowPng} onClick={page.openFileInNewWindow.bind(this)}/>
                            <div className={'chatDownloadFileNameDiv'}>Файл: {messageItem.fileName}</div>
                        </div>
                        <div style={{marginBottom:'10px',width:'100%',height:'100%'}}>
                            {addSmallCopyImgIfExist(messageItem)}
                        </div>
                    </div>
                )
            } else {
                return(null);
            }
        }

        function addMessage(messageItem, page) {
            return(
                <tr key={CommonUtils.genGuid()}>
                    <td key={CommonUtils.genGuid()} style={{width:'100%'}}>
                        <div className={messageItem.fromMe ? 'myMessage' : 'alienMessage'} key={CommonUtils.genGuid()}>
                            {addFileDivIfExist(messageItem, page)}
                            <div key={CommonUtils.genGuid()}>{messageItem.content}</div>
                            <div className={'messageSendTimeDiv'} key={CommonUtils.genGuid()}>Отправлено: {DateUtils.dateToStringWithTimeSec(messageItem.sendDate)}</div>
                            <div style={{paddingTop:'2px'}} className={'messageSendTimeDiv'} key={CommonUtils.genGuid()}>Прочитано: {DateUtils.dateToStringWithTimeSec(messageItem.readDate)}</div>
                        </div>
                    </td>
                </tr>
            )
        }

        function getCurrentUserMessage(page) {
            if (page.state.messages.get(page.state.selectedUser.entityId)) {
                let messageArr = page.state.messages.get(page.state.selectedUser.entityId);
                return (
                        messageArr.map((messageItem, messageIndex) => (
                            addMessage(messageItem, page)
                        ))
                )
            } else {
                return (null);
            }
        }

        function addUnreadDiv(unreadCount) {
            if (unreadCount && unreadCount > 0) {
                return (
                    <div style={{backgroundImage:`url(${unreadPng})`,backgroundSize:'cover'}} title={'Количество непрочитанных сообщений'} className={'unreadMessagesDiv'}>
                        <div className={'unreadMessagesNumber'}>{unreadCount}</div>
                    </div>
                )
            } else {
                return (null)
            }
        }

        function addWasOnlineDiv(userItem) {
            let userWasOnline = '';
            if (userItem.chatState === Const.ONLINE_STATE) {
                userWasOnline = 'В сети'
            } else {
                userWasOnline = 'Был(а) в сети ' + DateUtils.dateToStringWithTime(userItem.lastWasOnline)
            }
            return (
                <div className={'userWasLastTimeOnline'}>{userWasOnline}</div>
            )
        }

        return (
            <div style={{height:'99%',width:'100%'}}>
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
                                                    {addUnreadDiv(item.value.unread)}
                                                </td>
                                                <td>
                                                    <img alt={''} title={item.value.chatState === Const.ONLINE_STATE ? 'В сети' : 'Не в сети'} className={'userStateImg'} src={item.value.chatState === Const.ONLINE_STATE ? userOnlinePng : userOfflinePng}/>
                                                    <img alt={''} className={'userImg'} src={chatUserPng}/>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className={'userFioDiv'}>{item.value.fio}</div>
                                                        <div className={'userRoleDiv'}>{item.value.userRole}</div>
                                                        {addWasOnlineDiv(item.value)}
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
                                {getCurrentUserMessage(this)}
                            </tbody>
                        </table>
                    </div>
                    <div className={'chatMessageSendDiv'}>
                        <table style={{height:'100%',width:'100%',marginRight:'5px'}}>
                            <tbody>
                                <tr>
                                    <td style={{verticalAlign:'top'}}>
                                        <Field placeholder={'Введите сообщение'} formStyle={{marginRight:'0px',width:'100%'}} fieldWidth='100%' style={{resize:'none',height:'70px'}} maxLength={1000} type={Const.TEXTAREA} value={this.state.fields.common.message} onChange={(event) => this.handleChange(event.target.value,'message','common')}/>
                                    </td>
                                    <td className={'chatActionTd'}>
                                        <div className={'chatActionDiv'}>
                                            <img onClick={() => this.sendTextMessageToChat()} title={'Отправить сообщение'}  alt={'Отправить сообщение'} src={chatSendMessagePng} className={'chatActionImg'}/>
                                        </div>
                                    </td>
                                    <td className={'chatActionTd'}>
                                        <div className={'chatActionDiv'}>
                                            <img onClick={() => this.fileDialogOpen()} title={'Отправить файл'}  alt={'Отправить файл'} src={chatAddFilePng} className={'chatActionImg'}/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <ChatFileUploadModal mainPageComp={this.props.mainPageComp} visible={this.state.fileUploadVisible}
                                 okAction={this.sendFileMessageToChat.bind(this)}
                                 cancelAction={() => this.setState({fileUploadVisible:false})}/>
            </div>
        )
    }

}

export default ChatMainPanel