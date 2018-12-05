import React, {Component} from 'react';
import Tree, { TreeNode } from 'rc-tree';
import '../../../media/tree/tree.css';
import mainTreeIcon from '../../../media/tree/mainTreeIcon.png'
import anketaIcon from '../../../media/tree/anketa.png'
import obectiIcon from '../../../media/tree/obecti.png'
import dictsIcon from '../../../media/tree/dicts.png'
import usersIcon from '../../../media/tree/users.png'
import userRolesIcon from '../../../media/tree/userRoles.png'

import hideIcon from '../../../media/data/hide.png'
import showIcon from '../../../media/data/show.png'

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
        if ('Main' !== info.node.props.eventKey && 'dicts' !== info.node.props.eventKey) {
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