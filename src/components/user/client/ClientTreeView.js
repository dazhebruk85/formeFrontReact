import React, {Component} from 'react';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';

const treeData = [
    { key:'Main',title:'Главная', children:
        [
            {key:'ancets',title:'Анкеты'},
            {key:'dogovors',title:'Договоры'},
            {key:'obects',title:'Объекты'},
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