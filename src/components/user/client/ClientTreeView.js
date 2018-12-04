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
            {key:'ancets',icon:<img alt='' src={anketaIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Анкеты'},
            {key:'dogovors',icon:<img alt='' src={contractIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Договоры'},
            {key:'obects',icon:<img alt='' src={obectiIcon} style={{marginTop:"0px", marginLeft:"0px"}}/>,title:'Объекты'},
        ]
    }
];

class ClientTreeView extends Component {

    constructor() {
        super();
        this.state = {
            treeViewData: [],
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <Tree
                showLine={false}
                checkable={false}
                selectable={true}
                defaultExpandAll={true}
                treeData={treeData}
            />
        )
    }
}

export default ClientTreeView;