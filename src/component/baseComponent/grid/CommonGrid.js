import  React, { Component } from 'react';
import * as CommonUtils from "../../../utils/CommonUtils";
import addActionPng from '../../../media/data/gridAdd.png';
import deleteActionPng from '../../../media/data/gridDelete.png';

class CommonGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gridData:this.props.gridData,
            selectedItem:{},
            addAction:this.props.addAction,
            deleteAction:this.props.deleteAction,
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
        for (let i = 0; i < event.currentTarget.children.length; i++) {
            selectedItem[event.currentTarget.children[i].getAttribute('entitydatakey')] = event.currentTarget.children[i].textContent
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

        function addAddAction(state) {
            if (state.addAction) {
                return(
                    <img alt='' onClick={state.addAction} src={addActionPng} style={{cursor:'pointer',height:"20px",width:"20px"}}/>
                )
            }
        }

        function addDeleteAction(state) {
            if (state.deleteAction) {
                return(
                    <img alt='' onClick={state.deleteAction} src={deleteActionPng} style={{cursor:'pointer',height:"20px",width:"20px"}}/>
                )
            }
        }

        function addGridActions(state) {
            return(
                <div>
                    {addAddAction(state)}
                    {addDeleteAction(state)}
                </div>
            )
        }

        if (!CommonUtils.objectIsEmpty(this.state.gridData) && !CommonUtils.objectIsEmpty(this.state.gridData.headers)) {
            return (
                <div className="container" style={{paddingLeft:'0px', paddingRight:'0px', width:'100%',height:'100%'}}>
                    {addGridActions(this.state)}
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
                                }}
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

