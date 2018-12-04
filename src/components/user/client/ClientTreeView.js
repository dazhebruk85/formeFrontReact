import React, {Component} from 'react';
import Tree, { TreeNode } from 'rc-tree';
import '../../../media/tree/tree.css';
import mainTreeIcon from '../../../media/tree/mainTreeIcon.png'
import anketaIcon from '../../../media/tree/anketa.png'
import contractIcon from '../../../media/tree/contract.png'
import obectiIcon from '../../../media/tree/obecti.png'

const treeData = [
    { key:'Main',icon:<img alt='' src={mainTreeIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Главная',children:
        [
            {key:'obects',icon:<img alt='' src={obectiIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Объекты'}
            ,{key:'ancets',icon:<img alt='' src={anketaIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Анкеты'}
            //,{key:'dogovors',icon:<img alt='' src={contractIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Договоры'},

        ]
    }
];

class ClientTreeView extends Component {

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
        if ('Main' !== info.node.props.eventKey) {
            this.setState({
                selectedKeys:[info.node.props.eventKey]
            });
        }
        setTimeout(() => this.changeTreeChoiceAction(this.state), 0);

        //this.refs.clientTree.selectedKeys = selectedKeys
    };

    render() {
        return (
            <Tree
                ref='clientTree'
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

export default ClientTreeView;