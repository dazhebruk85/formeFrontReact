import React, {Component} from "react";
import CommonGrid from "../../../../baseComponent/grid/CommonGrid";
import ErrorModal from "../../../../baseComponent/modal/ErrorModal";
import HorizontalPanel from "../../../../baseComponent/panel/HorizontalPanel";
import VerticalPanel from "../../../../baseComponent/panel/VerticalPanel";
import addActionPng from "../../../../../media/grid/gridAdd.png";
import editActionPng from "../../../../../media/grid/gridEdit.png";
import deleteActionPng from "../../../../../media/grid/gridDelete.png";
import viewActionPng from "../../../../../media/grid/gridView.png";

export default class RoomExcludeObjectGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editFormVisible:false,
            editFormDisabled:false,
            errors:[],
            disabled:false
        };
        this.onChangeAction = props.onChangeAction;
    }

    componentDidUpdate(prevProps) {
        if (this.props.disabled !== prevProps.disabled ) {
            this.setState({
                disabled:this.props.disabled,
            });
        }
    }

    render() {

        let gridDisabled = this.state.disabled;

        let gridData = {headers:[],list:[]};
        if (this.props.parent && this.props.parent.state && this.props.parent.state.fields.excludeObjectList) {
            gridData.headers = this.props.parent.state.fields.excludeObjectList.headers;
            if (this.props.parent.state.addObjectSelected && this.props.parent.state.addObjectSelected.id) {
                let selectedAddObjectId = this.props.parent.state.addObjectSelected.id;
                let listFound = [];
                for (let index in this.props.parent.state.fields.excludeObjectList.list) {
                    if (this.props.parent.state.fields.excludeObjectList.list[index].addObjectId === selectedAddObjectId) {
                        listFound.push(this.props.parent.state.fields.excludeObjectList.list[index]);
                    }
                }
                gridData.list = listFound;
            }
        }

        return(
            <VerticalPanel style={{width:'100%'}}>
                <HorizontalPanel style={{marginBottom:'1px'}}>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => alert(1)} title={'Добавить запись'}  alt={'Добавить запись'} src={addActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => alert(1)} title={'Редактировать запись'}  alt={'Редактировать запись'} src={editActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => alert(1)} title={'Удалить запись'}  alt={'Удалить запись'} src={deleteActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={() => alert(1)} title={'Просмотреть запись'}  alt={'Просмотреть запись'} src={viewActionPng} className={'gridActionImg'}/>
                        </div>
                    </div>
                </HorizontalPanel>
                <CommonGrid ref={'excludeObjectGrid'}
                            gridData={gridData}
                            height={'120px'}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </VerticalPanel>
        )
    }

}