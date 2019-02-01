import React, {Component} from 'react';
import Tree from 'rc-tree';
import '../../../../media/tree/tree.css';
import mainTreeIcon from '../../../../media/tree/mainTreeIcon.png'
import anketaIcon from '../../../../media/tree/anketa.png'
import dictsIcon from '../../../../media/tree/dicts.png'
import usersIcon from '../../../../media/tree/users.png'
import userRolesIcon from '../../../../media/tree/userRoles.png'
import basePackageIcon from '../../../../media/tree/basePackage.png'
import roomTypeIcon from '../../../../media/tree/roomType.png'
import systemIcon from '../../../../media/tree/system.png'
import systemSettingsIcon from '../../../../media/tree/systemSettings.png'
import chatIcon from '../../../../media/tree/chat.png'

import notificationsIcon from '../../../../media/tree/notifocations.png'
import notifyTemplatesIcon from '../../../../media/tree/notifyTemplates.png'
import notifyMessagesIcon from '../../../../media/tree/notifyMessages.png'

import hideIcon from '../../../../media/data/hide.png'
import showIcon from '../../../../media/data/show.png'

const treeData = [
    { key:'Main',icon:<img alt='' src={mainTreeIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Главная',children:
        [
           {key:'repairApp',icon:<img alt='' src={anketaIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Анкеты'}
           ,{key:'chat',icon:<img alt='' src={chatIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Чат'}
           ,{key:'dicts',icon:<img alt='' src={dictsIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Справочники',children:
            [
                {key:'user',icon:<img alt='' src={usersIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Пользователи'}
               ,{key:'userRole',icon:<img alt='' src={userRolesIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Роли пользователя'}
               ,{key:'basePackage',icon:<img alt='' src={basePackageIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Базовые пакеты'}
               ,{key:'roomType',icon:<img alt='' src={roomTypeIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Типы помещений'}
            ]}
            ,{key:'notifications',icon:<img alt='' src={notificationsIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Оповещения',children:
                [
                    {key:'notifyTemplates',icon:<img alt='' src={notifyTemplatesIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Шаблоны'}
                    ,{key:'notifyMessages',icon:<img alt='' src={notifyMessagesIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Сообщения'}
                ]}
            ,{key:'system',icon:<img alt='' src={systemIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Система',children:
                [
                    {key:'systemSettings',icon:<img alt='' src={systemSettingsIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Настойки системы'}
                ]}
        ]
    }
];

class AdminTreeView extends Component {

    constructor(props) {
        super();
        this.state = {
            selectedKeys:[],
            showTree:true
        };
        this.onTreeSelect = this.onTreeSelect.bind(this);
        this.showHideTree = this.showHideTree.bind(this);

        this.changeTreeChoiceAction = props.changeTreeChoiceAction
    }

    componentDidMount() {
    }

    onTreeSelect = (selectedKeys, info) => {
        if ('Main' !== info.node.props.eventKey &&
            'dicts' !== info.node.props.eventKey &&
            'system' !== info.node.props.eventKey &&
            'notifications' !== info.node.props.eventKey) {
            this.setState({
                selectedKeys:[info.node.props.eventKey]
            });
            setTimeout(() => this.changeTreeChoiceAction(this.state), 0);
        }
    };

    showHideTree() {
        let show = !this.state.showTree
        this.setState({
            showTree: show
        });
        if (show) {
            this.refs.adminTreeTd.className = 'tree_is_open'
        } else {
            this.refs.adminTreeTd.className = 'tree_is_not_open'
        }
    }

    render() {
        return (
            <table style={{height:'100%',borderRight:'1px solid transparent',borderColor:'#ddd'}}>
                <tbody>
                    <tr>
                        <td ref='adminTreeTd' style={{width:'250px', verticalAlign:'top'}}>
                            <Tree
                                ref='adminTree'
                                showLine={false}
                                checkable={false}
                                selectable={true}
                                selectedKeys={this.state.selectedKeys}
                                defaultExpandAll={true}
                                treeData={treeData}
                                onSelect={this.onTreeSelect}
                            />
                        </td>
                        <td style={{verticalAlign:'top'}}>
                            <img onClick={() => this.showHideTree()} alt='' align={'right'} src={this.state.showTree ? hideIcon : showIcon} style={{marginTop:'5px',marginRight:'5px',cursor:'pointer',height:"24px",width:"24px"}}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default AdminTreeView;