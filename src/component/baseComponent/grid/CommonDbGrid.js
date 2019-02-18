import  React, { Component } from 'react';
import * as Const from "../../../Const";
import * as CommonUtils from '../../../utils/CommonUtils'
import nextPagePng from "../../../media/grid/nextPage.png";
import prevPagePng from "../../../media/grid/prevPage.png";
import Spinner from "../spinner/Spinner";
import ErrorModal from '../../../component/baseComponent/modal/ErrorModal';
import './../../../media/grid/commonDbGrid.css';

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
            filter:props.filter
        };

        this.getGridListData = this.getGridListData.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.handleSelectEntity = this.handleSelectEntity.bind(this);
        this.parentSelectAction = props.selectAction
    }

    componentDidMount() {
        this.getGridListData()
    }

    async getGridListData() {
        this.setState({isLoading:true});
        let params = {pageNumber:this.state.pageNumber,pageSize:this.state.pageSize,filter:this.props.filter};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,this.state.dataEntityContext,Const.ENTITY_LIST,params);
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setGridData({
                listData: responseData.frontListData,
            });
        }
    }

    setGridData(props) {
        this.setState({
            listData:props.listData,
            lastPage:props.listData.lastPage,
            selectedItem:{}
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

        if (this.state.listData === undefined || this.state.listData === null) {
            return (
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            )
        } else {
            return (
                <div className="container" style={{paddingLeft:'0px', paddingRight:'0px', width:'100%',height:'100%'}}>
                    <div ref='parentForSpinner' className="panel panel-default" style={{overflowY:'auto',position:'inherit', height:'345px',marginTop:"10px",marginLeft:"10px",marginBottom:"5px"}}>
                        <Spinner isLoading={this.state.isLoading}/>
                        <table style={{marginBottom:'0px'}} className='table table-hover table-condensed' ref="CommonDbGrid">
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
                                    <tr onClick={this.handleSelectEntity} style={{cursor:'pointer',height:'30px',background:getSelectedBgColor(entity.entityId, this.state)}} key={entity.entityId+'valueTr'}>
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
                                             className={'pageButton'}
                                             onClick={this.prevPage}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={'pageText'} style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                        {this.state.pageNumber}
                                    </div>
                                </td>
                                <td>
                                    <div style={{width:'100%',height:'100%',padding:'0px',textAlign:'-webkit-center'}}>
                                        <img title={'Следующая страница'}
                                             alt='Следующая страница'
                                             src={nextPagePng}
                                             className={'pageButton'}
                                             onClick={this.nextPage}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                </div>
            );
        }
    }
}

export default CommonDbGrid;