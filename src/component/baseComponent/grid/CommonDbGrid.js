import  React, { Component } from 'react';
import * as Const from "../../../Const";
import * as CommonUtils from '../../../utils/CommonUtils'
import * as DateUtils from '../../../utils/DateUtils'
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
            headers:[],
            list:[],
            lastPage:false,
            pageNumber:0,
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
        let params = {pageNumber:this.state.pageNumber,filter:this.props.filter};
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,this.props.context,Const.ENTITY_LIST,params);
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                headers:responseData.entityList.headers,
                list:responseData.entityList.list,
                lastPage:responseData.entityList.lastPage,
                selectedItem:{}
            });
        }
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
        if (this.state.pageNumber === 0) {
            return;
        }
        this.setState({
            pageNumber:this.state.pageNumber-1
        });
        setTimeout(() => this.getGridListData(), 0);
    }

    handleSelectEntity = (event) => {
        if (event !== null && event !== undefined) {
            let selectedId;
            for (let i = 0; i < event.currentTarget.children.length; i++) {
                if (event.currentTarget.children[i].getAttribute('entitydatakey') === 'id') {
                    selectedId = event.currentTarget.children[i].textContent;
                    break;
                }
            }
            if (selectedId) {
                let selectedItem = this.state.list.find(listObject => listObject.id === selectedId);
                this.setState({
                    selectedItem: selectedItem
                });
                if (this.parentSelectAction) {
                    setTimeout(() => this.parentSelectAction(selectedItem), 0);
                }
            }
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

        function getColumnValue(value, fieldType) {
            if (value) {
                switch(fieldType) {
                    case "date":
                        return DateUtils.dateToString(new Date(value));
                    case "dateTime":
                        return DateUtils.dateToStringWithTime(new Date(value));
                    case "decimal":
                        return value.toFixed(2);
                    default:
                        return value;
                }
            } else {
                return value
            }
        }

        if (!CommonUtils.objectIsEmpty(this.state.headers)) {
            return (
                <div className="container" style={{paddingLeft:'0px', paddingRight:'0px', width:'100%',height:'100%'}}>
                    <div ref='parentForSpinner' className="panel panel-default" style={{overflowY:'auto',position:'inherit', height:'330px',marginTop:"10px",marginLeft:"10px",marginBottom:"5px"}}>
                        <Spinner isLoading={this.state.isLoading}/>
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
                                            {getColumnValue(listItem[headerItem.field], headerItem.type)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
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
                                        {this.state.pageNumber+1}
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
        } else {
            return (<div/>)
        }
    }
}

export default CommonDbGrid;