import React, {Component} from 'react';
import Tree from 'rc-tree';
import '../../../../media/tree/tree.css';
import mainTreeIcon from '../../../../media/tree/mainTreeIcon.png'
import anketaIcon from '../../../../media/tree/anketa.png'
import hideIcon from '../../../../media/common/hide.png'
import showIcon from '../../../../media/common/show.png'
import chatIcon from "../../../../media/tree/chat.png";

const treeData = [
    { key:'Main',canSelect:false,icon:<img alt='' src={mainTreeIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Главная',children:
        [
            {key:'repairApp',canSelect:true,icon:<img alt='' src={anketaIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Анкеты'}
            ,{key:'chat',canSelect:true,icon:<img alt='' src={chatIcon} style={{width:'20px',height:'20px',marginTop:"0px", marginLeft:"0px"}}/>,title:'Чат'}
        ]
    }
];

class ClientTreeView extends Component {

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
        if (info.node.props.canSelect) {
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
            this.refs.clientTreeTd.className = 'tree_is_open'
        } else {
            this.refs.clientTreeTd.className = 'tree_is_not_open'
        }
    }

    render() {
        return (
            <table style={{height:'100%',borderRight:'1px solid transparent',borderColor:'#ddd'}}>
                <tbody>
                <tr>
                    <td ref='clientTreeTd' style={{width:'250px', verticalAlign:'top'}}>
                        <Tree
                            ref='clientTree'
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
                        <img onClick={() => this.showHideTree()} alt='' align={'right'} src={this.state.showTree ? hideIcon : showIcon} className={'showHideButton'}/>
                    </td>
                </tr>
                </tbody>
            </table>

        )
    }
}

export default ClientTreeView;