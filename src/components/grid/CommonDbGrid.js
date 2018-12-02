import  React, { Component } from 'react';
import cookie from "react-cookies";
import axios from "axios";
import * as Const from "../../Const";
import SelectableTable from 'react-selectable-table';
import * as CommonUtils from '../../utils/CommonUtils'
import nextPagePng from "../../media/data/nextPage.png";
import prevPagePng from "../../media/data/prevPage.png";


class CommonDbGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            dataEntityContext:props.dataEntityContext,
            pageSize:props.pageSize,
            pageNumber:1,
            lastPage:false,
            listData:null,
            selectedIndicies:[]
        };

        this.getGridListData = this.getGridListData.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
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
            listData:props.listData,
            lastPage:props.listData.lastPage
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

    nextPage() {
        if (this.state.lastPage) {
            return;
        }
        this.setState({
            pageNumber:this.state.pageNumber+1
        })
        setTimeout(() => this.getGridListData(), 0);
    }

    prevPage() {
        if (this.state.pageNumber === 1) {
            return;
        }
        this.setState({
            pageNumber:this.state.pageNumber-1
        })
        setTimeout(() => this.getGridListData(), 0);
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

                    <table style={{width:'100px'}}>
                        <tbody>
                            <tr>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                        <img title={'Предыдущая страница'}
                                             alt='Предыдущая страница'
                                             src={prevPagePng}
                                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}
                                             onClick={this.prevPage}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                        {this.state.pageNumber}
                                    </div>
                                </td>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                        <img title={'Следующая страница'}
                                             alt='Следующая страница'
                                             src={nextPagePng}
                                             style={{width:'28px',height:'28px',cursor:'pointer',marginTop:"0px", marginLeft:"0px"}}
                                             onClick={this.nextPage}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            );
        }
    }
}

export default CommonDbGrid;