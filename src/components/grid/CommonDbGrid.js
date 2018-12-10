import  React, { Component } from 'react';
import cookie from "react-cookies";
import * as Const from "../../Const";
import * as CommonUtils from '../../utils/CommonUtils'
import nextPagePng from "../../media/data/nextPage.png";
import prevPagePng from "../../media/data/prevPage.png";
import Spinner from "../spinner/Spinner";

class CommonDbGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading:false,
            errors:[],
            dataEntityContext:props.dataEntityContext,
            pageSize:props.pageSize,
            pageNumber:1,
            lastPage:false,
            listData:null,
            selectedItem:{},
        };

        this.getGridListData = this.getGridListData.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.parentSelectAction = props.selectAction
    }

    componentDidMount() {
        this.getGridListData()
    }

    componentDidUpdate() {

    }

    async getGridListData() {
        this.setState({isLoading:true});
        let params = {pageNumber:this.state.pageNumber,pageSize:this.state.pageSize};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,this.state.dataEntityContext,Const.ENTITY_LIST,params,cookie.load('sessionId'));
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setGridData({listData: responseData.frontListData});
        }
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
        setTimeout(() => this.parentSelectAction(selectedItem), 0);
    };

    render() {

        if (this.state.listData === undefined || this.state.listData === null) {
            return null
        } else {
            return (
                <div className="container" style={{width:'100%',height:'100%'}}>
                    <div ref='parentForSpinner' className="panel panel-default" style={{position:'inherit', width:'inherit',height:'340px',margin:"10px"}}>
                        <Spinner isLoading={this.state.isLoading}/>
                        <table style={{marginBottom:'0px'}} className='table table-striped table-hover table-condensed' ref="CommonDbGrid">
                            <thead className='.thead-light'>
                                {this.state.listData.dataHeaderList.map(entity =>
                                    <tr key={entity.entityId+'headerTr'}>
                                        {CommonUtils.objectToPropArr(entity).map(entityData =>
                                            <th style={{display: entityData.key === "entityId" ? 'none' : ''}} key={entityData.key+'headerTd'}>
                                                {entityData.value}
                                            </th>
                                        )}
                                    </tr>
                                )}
                              </thead>
                            <tbody>
                                {this.state.listData.dataList.map(entity =>
                                    <tr onClick={this.handleSelectEntity} style={{cursor:'pointer',height:'30px'}} key={entity.entityId+'valueTr'}>
                                        {CommonUtils.objectToPropArr(entity).map(entityData =>
                                            <td entitydatakey={entityData.key} style={{padding:'5px',height:'30px',display: entityData.key === "entityId" ? 'none' : ''}} key={entityData.key+'valueTd'}>
                                                {entityData.value}
                                            </td>
                                        )}
                                     </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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