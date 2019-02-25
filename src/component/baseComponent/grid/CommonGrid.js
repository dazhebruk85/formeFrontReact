import  React, { Component } from 'react';
import * as CommonUtils from "../../../utils/CommonUtils";

class CommonGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            headers:[],
            list:[],
            selectedItem:{},
            height:this.props.height
        };

        this.handleSelectEntity = this.handleSelectEntity.bind(this);
        this.parentSelectAction = props.selectAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.gridData && this.props.gridData !== prevProps.gridData ) {
            this.setState({
                headers:this.props.gridData.headers,
                list:this.props.gridData.list
            })
        }
    }

    handleSelectEntity = (event) => {
        let selectedItem = {};
        if (event !== null && event !== undefined) {
            for (let i = 0; i < event.currentTarget.children.length; i++) {
                selectedItem[event.currentTarget.children[i].getAttribute('entitydatakey')] = event.currentTarget.children[i].textContent
            }
        }
        this.setState({
            selectedItem: selectedItem
        });
        if (this.parentSelectAction) {
            setTimeout(() => this.parentSelectAction(selectedItem), 0);
        }
    };

    render() {

        function getSelectedBgColor(entityId, state) {
            if (entityId === state.selectedItem.id) {
                return '#d9d9d9';
            }
        }

        let sortedHeaders = this.state.headers ? this.state.headers.sort(
            function(a, b){
                if (a.order < b.order)
                    return -1;
                if (a.order > b.order)
                    return 1;
                return 0;
            }) : [];

        if (!CommonUtils.objectIsEmpty(this.state.headers)) {
            return (
                <div style={{height:this.state.height,overflowY:'auto',border:'1px solid #ddd',borderRadius:'4px'}}>
                    <table style={{marginBottom:'0px'}} className='table table-hover table-condensed' ref="CommonDbGrid">
                        <thead className='.thead-light'>
                        <tr>
                            {sortedHeaders.map((headerItem, index) => (
                                <th style={{display: headerItem.field === "id" ? 'none' : ''}} key={headerItem.field+'headerTh'}>
                                    {headerItem.name}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.list.map((listItem, index) => (
                            <tr onClick={this.handleSelectEntity} style={{cursor:'pointer',height:'30px',background:getSelectedBgColor(listItem.id, this.state)}} key={listItem.id+'valueTr'}>
                                {sortedHeaders.map((headerItem, index) => (
                                    <td entitydatakey={headerItem.field} style={{padding:'5px',height:'30px',display: headerItem.field === "id" ? 'none' : ''}} key={listItem.id+headerItem.field+'valueTd'}>
                                        {listItem[headerItem.field]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (<div/>)
        }
    }

}

export default CommonGrid;

