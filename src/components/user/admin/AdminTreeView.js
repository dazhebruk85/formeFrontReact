import React, {Component} from 'react';
import Tree, { TreeNode } from 'rc-tree';
import '../../../media/tree/tree.css';
import mainTreeIcon from '../../../media/tree/mainTreeIcon.png'
import anketaIcon from '../../../media/tree/anketa.png'
import obectiIcon from '../../../media/tree/obecti.png'
import dictsIcon from '../../../media/tree/dicts.png'
import usersIcon from '../../../media/tree/users.png'
import userRolesIcon from '../../../media/tree/userRoles.png'

const treeData = [
    { key:'Main',icon:<img alt='' src={mainTreeIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Главная',children:
        [
            {key:'obects',icon:<img alt='' src={obectiIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Объекты'}
           ,{key:'ancets',icon:<img alt='' src={anketaIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Анкеты'}
           ,{key:'dicts',icon:<img alt='' src={dictsIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Справочники',children:
            [
                {key:'users',icon:<img alt='' src={usersIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Пользователи'}
               ,{key:'userRoles',icon:<img alt='' src={userRolesIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Роли пользователя'}
            ]}
        ]
    }
];

class AdminTreeView extends Component {

    constructor(props) {
        super();
        this.state = {
            selectedKeys:[]
        };
        this.changeTreeChoiceAction = props.changeTreeChoiceAction
        this.onRbSelect = this.onRbSelect.bind(this);
    }

    componentDidMount() {
    }

    onRbSelect = (selectedKeys, info) => {
        if ('Main' !== info.node.props.eventKey && 'dicts' !== info.node.props.eventKey) {
            this.setState({
                selectedKeys:[info.node.props.eventKey]
            });
            setTimeout(() => this.changeTreeChoiceAction(this.state), 0);
        }
    };

    render() {
        return (
            <Tree
                ref='adminTree'
                showLine={false}
                checkable={false}
                selectable={true}
                selectedKeys={this.state.selectedKeys}
                defaultExpandAll={true}
                treeData={treeData}
                onSelect={this.onRbSelect}
            />
        )
    }
}

export default AdminTreeView;