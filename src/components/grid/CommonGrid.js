import  React, { Component } from 'react';
import cookie from "react-cookies";
import axios from "axios";
import * as Const from "../../Const";
import SelectableTable from 'react-selectable-table';
import * as CommonUtils from '../../utils/CommonUtils'

class CommonGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            dataEntityContext:props.dataEntityContext,
            pageSize:props.pageSize,
            pageNumber:1,
            lastPage:false,
            allEntityCount:null,
            listData:null,
            selectedIndicies:[]
        };

        this.getGridListData = this.getGridListData.bind(this);
        this.setErrors = this.setErrors.bind(this);
    }

    componentDidMount() {
        this.getGridListData()
    }

    getGridListData() {
        let listPostEvent = axios.post(Const.APP_URL, {
            context: this.state.dataEntityContext,
            action: Const.ENTITY_LIST,
            sessionId: cookie.load('sessionId'),
            params: {
                pageNumber: this.state.pageNumber,
                pageSize: this.state.pageSize
            }
        });
        listPostEvent.then(res => {
            this.setGridData({listData: res.data.frontListData});
        });
        listPostEvent.catch(error => {
            if (!error.status) {
                this.setErrors([{code:'SYS',message:'APP сервер недоступен'}])
            } else {
                this.setErrors([{code:'SYS',message:'Непредвиденная ошибка на сервере'}])
            }
        });
    }

    setGridData(props) {
        this.setState({
            listData: props.listData
        });
    }

    setErrors(errors) {
        this.setState({
            errors: errors
        });
    }

    onSelectionChange() {
        this.setState({ selectedIndicies: this.refs.table.getSelectedIndices() })
    }

    render() {
        if (this.state.listData === undefined || this.state.listData === null) {
            return null
        } else {
            return (
                <div>
                    <SelectableTable className='table table-striped table-hover table-condensed' onChange={this.onSelectionChange.bind(this)} ref="table">
                        <thead className='.thead-light'>
                            {this.state.listData.dataHeaderList.map(entity =>
                                <tr key={entity.dataObjectId+'headerTr'}>
                                    {CommonUtils.objectToPropArr(entity).map(entityData =>
                                        <th key={entityData.key+'headerTd'}>
                                            {entityData.value}
                                        </th>
                                    )}
                                </tr>
                            )}
                          </thead>
                        <tbody>
                            {this.state.listData.dataList.map(entity =>
                                <tr key={entity.dataObjectId+'valueTr'}>
                                    {CommonUtils.objectToPropArr(entity).map(entityData =>
                                        <td key={entityData.key+'valueTd'}>
                                            {entityData.value}
                                        </td>
                                    )}
                                 </tr>
                            )}
                        </tbody>
                    </SelectableTable>
                </div>
            );
        }
    }
}

export default CommonGrid;