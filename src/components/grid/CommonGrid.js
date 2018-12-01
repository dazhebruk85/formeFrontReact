import { Component } from 'react';
import cookie from "react-cookies";
import axios from "axios";
import * as Const from "../../Const";

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
            listData:null
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

    render() {
        return (null);
    }

}

export default CommonGrid;