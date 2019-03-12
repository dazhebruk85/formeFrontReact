import React, {Component} from "react";
import CommonGrid from "../../../../../baseComponent/grid/CommonGrid";
import ErrorModal from "../../../../../baseComponent/modal/ErrorModal";
import HorizontalPanel from "../../../../../baseComponent/panel/HorizontalPanel";
import VerticalPanel from "../../../../../baseComponent/panel/VerticalPanel";
import addActionPng from "../../../../../../media/grid/gridAdd.png";
import editActionPng from "../../../../../../media/grid/gridEdit.png";
import deleteActionPng from "../../../../../../media/grid/gridDelete.png";
import viewActionPng from "../../../../../../media/grid/gridView.png";
import RoomExcludeObjectEditForm, {fieldsObject as excludeObjectFieldsObject} from "./RoomExcludeObjectEditForm";
import * as CommonUtils from "../../../../../../utils/CommonUtils";
import {fieldsObject as addObjectFieldsObject} from "../addobject/RoomAddObjectEditForm";

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
        this.parentComp = this.props.parent;
    }

    componentDidUpdate(prevProps) {
        if (this.props.disabled !== prevProps.disabled ) {
            this.setState({
                disabled:this.props.disabled,
            });
        }
    }

    openEditForm(entity, disabled) {
        if (!CommonUtils.objectIsEmpty(entity) && !CommonUtils.objectIsEmpty(this.parentComp.state.addObjectSelected)) {
            if (!entity.addObjectId) {
                entity.addObjectId = this.parentComp.state.addObjectSelected.id;
            }
            this.refs.excludeObjectEditForm.setState({
                fields:entity
            });
            setTimeout(() => this.setState({
                editFormVisible:true,
                editFormDisabled:disabled
            }), 0);
        }
    }

    changeList(entity,action) {
        CommonUtils.commonChangeEntityInGrid(this.parentComp,'excludeObjectList',entity,action);
        this.refs.excludeObjectGrid.setState({selectedItem:{}});
    }

    render() {

        let gridDisabled = this.state.disabled;

        let gridData = {headers:[],list:[]};
        if (this.parentComp && this.parentComp.state && this.parentComp.state.fields.excludeObjectList) {
            gridData.headers = this.parentComp.state.fields.excludeObjectList.headers;
            if (this.parentComp.state.addObjectSelected && this.parentComp.state.addObjectSelected.id) {
                let selectedAddObjectId = this.parentComp.state.addObjectSelected.id;
                let listFound = [];
                for (let index in this.parentComp.state.fields.excludeObjectList.list) {
                    if (this.parentComp.state.fields.excludeObjectList.list[index].addObjectId === selectedAddObjectId) {
                        listFound.push(this.parentComp.state.fields.excludeObjectList.list[index]);
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
                            <img onClick={gridDisabled ? null : () => this.openEditForm(excludeObjectFieldsObject,false)} title={'Добавить запись'}  alt={'Добавить запись'} src={addActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.openEditForm(this.refs.excludeObjectGrid.state.selectedItem,false)} title={'Редактировать запись'}  alt={'Редактировать запись'} src={editActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.changeList(this.refs.excludeObjectGrid.state.selectedItem,CommonUtils.DELETE_GRID_ENTITY)} title={'Удалить запись'}  alt={'Удалить запись'} src={deleteActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={() => this.openEditForm(this.refs.excludeObjectGrid.state.selectedItem,true)} title={'Просмотреть запись'}  alt={'Просмотреть запись'} src={viewActionPng} className={'gridActionImg'}/>
                        </div>
                    </div>
                </HorizontalPanel>
                <CommonGrid ref={'excludeObjectGrid'}
                            gridData={gridData}
                            height={'120px'}/>
                <RoomExcludeObjectEditForm mainPageComp={this.props.mainPageComp} disabled={this.state.editFormDisabled} ref={'excludeObjectEditForm'} visible={this.state.editFormVisible} okAction={(event) => this.changeList(event,CommonUtils.EDIT_GRID_ENTITY)} closeAction={() => {this.setState({editFormVisible:false}); this.refs.excludeObjectGrid.setState({selectedItem:{}});}}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </VerticalPanel>
        )
    }

}