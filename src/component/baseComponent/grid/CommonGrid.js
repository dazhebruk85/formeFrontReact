import  React, { Component } from 'react';
import * as CommonUtils from "../../../utils/CommonUtils";

class CommonGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gridData:this.props.gridData,
            selectedItem:{},
            height:this.props.height
        };

        this.handleSelectEntity = this.handleSelectEntity.bind(this);
        this.parentSelectAction = props.selectAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.gridData && this.props.gridData !== prevProps.gridData ) {
            this.setState({
                gridData:this.props.gridData
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
            if (entityId === state.selectedItem.entityId) {
                return '#d9d9d9';
            }
        }

        if (!CommonUtils.objectIsEmpty(this.state.gridData) && !CommonUtils.objectIsEmpty(this.state.gridData.headers)) {
            return (
                <div style={{height:this.state.height,overflowY:'auto',border:'1px solid #ddd',borderRadius:'4px'}}>
                    <table style={{marginBottom:'0px'}} className='table table-hover table-condensed' ref="CommonDbGrid">
                        <thead className='.thead-light'>
                        <tr>
                            {CommonUtils.objectToPropArr(this.state.gridData.headers).map(entity =>
                                <th style={{display: entity.key === "entityId" ? 'none' : ''}} key={entity.key+'headerTd'}>
                                    {entity.value}
                                </th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {CommonUtils.objectToPropArr(this.state.gridData).map(entity =>
                            {if("headers" !== entity.key) {
                                return(
                                    <tr onClick={this.handleSelectEntity} style={{cursor:'pointer',height:'30px',background:getSelectedBgColor(entity.key, this.state)}} key={entity.key+'valueTr'}>
                                        {CommonUtils.objectToPropArr(entity.value).map(entityData =>
                                            <td entitydatakey={entityData.key} style={{padding:'5px',height:'30px',display: entityData.key === "entityId" ? 'none' : ''}} key={entityData.key+'valueTd'}>
                                                {entityData.value}
                                            </td>
                                        )}
                                    </tr>
                                )
                            }
                            return null
                            }
                        )}
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

