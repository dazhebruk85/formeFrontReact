import  React, { Component } from 'react';
import cookie from "react-cookies";
import axios from "axios";
import * as Const from "../../Const";
import * as CommonUtils from '../../utils/CommonUtils'
import nextPagePng from "../../media/data/nextPage.png";
import prevPagePng from "../../media/data/prevPage.png";
import spinnerSvg from '../../media/spinner.svg';

class CommonDbGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading:true,
            errors:[],
            dataEntityContext:props.dataEntityContext,
            pageSize:props.pageSize,
            pageNumber:1,
            lastPage:false,
            listData:null,
            selectedItem:{}
        };

        this.getGridListData = this.getGridListData.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }

    componentDidMount() {
        this.getGridListData()
    }

    componentDidUpdate() {

    }

    getGridListData() {
        setTimeout(() => this.setState({ isLoading: true }), 0);
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
        setTimeout(() => this.setState({ isLoading: false }), 300);
    }

    setErrors(errors) {
        this.setState({
            errors: errors
        });
        setTimeout(() => this.setState({ isLoading: false }), 300);
    }

    nextPage() {
        if (this.state.lastPage) {
            return;
        }
        this.setState({
            pageNumber:this.state.pageNumber+1
        });
        setTimeout(() => this.getGridListData(), 0);
    }

    prevPage() {
        if (this.state.pageNumber === 1) {
            return;
        }
        this.setState({
            pageNumber:this.state.pageNumber-1
        });
        setTimeout(() => this.getGridListData(), 0);
    }

    handleSelectEntity = (event) => {
        let selectedItem = {};
        for (let i = 0; i < event.currentTarget.children.length; i++) {
            selectedItem[event.currentTarget.children[i].getAttribute('entitydatakey')] = event.currentTarget.children[i].textContent
        }
        this.setState({
            selectedItem: selectedItem
        });
    };

    render() {

        const { isLoading } = this.state;
        if (isLoading) {
            return (
                <div className="container" style={{width:'100%',height:'100%'}}>
                    <img alt='' src={spinnerSvg} style={{position:'absolute',top:'50%',left:'50%'}}/>
                </div>
            )
        }

        if (this.state.listData === undefined || this.state.listData === null) {
            return null
        } else {
            return (
                <div className="container" style={{width:'100%',height:'100%'}}>
                    <table  style={{height:'370px',marginBottom:'0px'}} className='table table-striped table-hover table-condensed' ref="CommonDbGrid">
                        <thead className='.thead-light'>
                            {this.state.listData.dataHeaderList.map(entity =>
                                <tr key={entity.dataObjectId+'headerTr'}>
                                    {CommonUtils.objectToPropArr(entity).map(entityData =>
                                        <th style={{display: entityData.key === "dataObjectId" ? 'none' : ''}} key={entityData.key+'headerTd'}>
                                            {entityData.value}
                                        </th>
                                    )}
                                </tr>
                            )}
                          </thead>
                        <tbody>
                            {this.state.listData.dataList.map(entity =>
                                <tr onClick={this.handleSelectEntity} style={{cursor:'pointer'}} key={entity.dataObjectId+'valueTr'}>
                                    {CommonUtils.objectToPropArr(entity).map(entityData =>
                                        <td entitydatakey={entityData.key} style={{display: entityData.key === "dataObjectId" ? 'none' : ''}} key={entityData.key+'valueTd'}>
                                            {entityData.value}
                                        </td>
                                    )}
                                 </tr>
                            )}
                        </tbody>
                    </table>

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