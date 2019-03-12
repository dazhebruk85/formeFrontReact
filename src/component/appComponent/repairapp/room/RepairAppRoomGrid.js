import {Component} from "react";
import CommonGrid from "../../../baseComponent/grid/CommonGrid";
import React from "react";
import RepairAppRoomEditForm, {fieldsObject as roomFieldsObject}  from "./RepairAppRoomEditForm";
import * as CommonUtils from "../../../../utils/CommonUtils";
import ErrorModal from "../../../baseComponent/modal/ErrorModal";
import addActionPng from '../../../../media/grid/gridAdd.png';
import deleteActionPng from '../../../../media/grid/gridDelete.png';
import editActionPng from '../../../../media/grid/gridEdit.png';
import viewActionPng from '../../../../media/grid/gridView.png';
import VerticalPanel from "../../../baseComponent/panel/VerticalPanel";
import HorizontalPanel from "../../../baseComponent/panel/HorizontalPanel";

export default class RepairAppRoomGrid extends Component {

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
        if (!CommonUtils.objectIsEmpty(entity)) {
            this.refs.roomEditForm.setState({
                fields:entity
            });
            setTimeout(() => this.setState({
                editFormVisible:true,
                editFormDisabled:disabled
            }), 0);
        }
    }

    changeList(entity,action) {
        CommonUtils.commonChangeEntityInGrid(this.parentComp,'roomList',entity,action);
        this.refs.roomsGrid.setState({selectedItem:{}});
        setTimeout(() => this.parentComp.cnangeTotalArea(), 0);
        setTimeout(() => this.parentComp.changeTotalCost(), 0);
    }

    render() {

        let gridDisabled = this.state.disabled;

        return(
            <VerticalPanel style={{width:'100%'}}>
                <HorizontalPanel style={{marginBottom:'1px'}}>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.openEditForm(roomFieldsObject,false)} title={'Добавить запись'}  alt={'Добавить запись'} src={addActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.openEditForm(this.refs.roomsGrid.state.selectedItem,false)} title={'Редактировать запись'}  alt={'Редактировать запись'} src={editActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.changeList(this.refs.roomsGrid.state.selectedItem,CommonUtils.DELETE_GRID_ENTITY)} title={'Удалить запись'}  alt={'Удалить запись'} src={deleteActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={() => this.openEditForm(this.refs.roomsGrid.state.selectedItem,true)} title={'Просмотреть запись'}  alt={'Просмотреть запись'} src={viewActionPng} className={'gridActionImg'}/>
                        </div>
                    </div>
                </HorizontalPanel>
                <CommonGrid ref={'roomsGrid'}
                            gridData={this.parentComp && this.parentComp.state && this.parentComp.state.fields.roomList ? this.parentComp.state.fields.roomList : {}}
                            height={'120px'}/>
                <RepairAppRoomEditForm mainPageComp={this.props.mainPageComp} disabled={this.state.editFormDisabled} ref={'roomEditForm'} visible={this.state.editFormVisible} okAction={(event) => this.changeList(event,CommonUtils.EDIT_GRID_ENTITY)} closeAction={() => {this.setState({editFormVisible:false}); this.refs.roomsGrid.setState({selectedItem:{}});}}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </VerticalPanel>
        )
    }
}