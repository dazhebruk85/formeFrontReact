import React, {Component} from "react";
import CommonGrid from "../../../../../baseComponent/grid/CommonGrid";
import ErrorModal from "../../../../../baseComponent/modal/ErrorModal";
import HorizontalPanel from "../../../../../baseComponent/panel/HorizontalPanel";
import VerticalPanel from "../../../../../baseComponent/panel/VerticalPanel";
import addActionPng from "../../../../../../media/grid/gridAdd.png";
import editActionPng from "../../../../../../media/grid/gridEdit.png";
import deleteActionPng from "../../../../../../media/grid/gridDelete.png";
import viewActionPng from "../../../../../../media/grid/gridView.png";
import RoomAddObjectEditForm, {fieldsObject as addObjectFieldsObject} from "./RoomAddObjectEditForm";
import * as CommonUtils from "../../../../../../utils/CommonUtils";

export default class RoomAddObjectGrid extends Component {

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
            this.refs.addObjectEditForm.setState({
                fields:entity
            });
            setTimeout(() => this.setState({
                editFormVisible:true,
                editFormDisabled:disabled
            }), 0);
        }
    }

    changeList(entity,action) {
        CommonUtils.commonChangeEntityInGrid(this.parentComp,'addObjectList',entity,action);
        this.refs.addObjectGrid.setState({selectedItem:{}});
    }

    selectAddObject(selected) {
        this.parentComp.setState({addObjectSelected:selected})
    }

    render() {

        let gridDisabled = this.state.disabled;

        return(
            <VerticalPanel style={{width:'100%'}}>
                <HorizontalPanel style={{marginBottom:'1px'}}>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.openEditForm(addObjectFieldsObject,false)} title={'Добавить запись'}  alt={'Добавить запись'} src={addActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.openEditForm(this.refs.addObjectGrid.state.selectedItem,false)} title={'Редактировать запись'}  alt={'Редактировать запись'} src={editActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={gridDisabled ? null : () => this.changeList(this.refs.addObjectGrid.state.selectedItem,CommonUtils.DELETE_GRID_ENTITY)} title={'Удалить запись'}  alt={'Удалить запись'} src={deleteActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                        </div>
                    </div>
                    <div className={'gridActionTd'}>
                        <div className={'gridActionDiv'}>
                            <img onClick={() => this.openEditForm(this.refs.addObjectGrid.state.selectedItem,true)} title={'Просмотреть запись'}  alt={'Просмотреть запись'} src={viewActionPng} className={'gridActionImg'}/>
                        </div>
                    </div>
                </HorizontalPanel>
                <CommonGrid ref={'addObjectGrid'}
                            gridData={this.parentComp && this.parentComp.state && this.parentComp.state.fields.addObjectList ? this.parentComp.state.fields.addObjectList : {}}
                            height={'120px'}
                            selectAction={(selected) => this.selectAddObject(selected)}/>
                <RoomAddObjectEditForm mainPageComp={this.props.mainPageComp} disabled={this.state.editFormDisabled} ref={'addObjectEditForm'} visible={this.state.editFormVisible} okAction={(event) => this.changeList(event,CommonUtils.EDIT_GRID_ENTITY)} closeAction={() => {this.setState({editFormVisible:false}); this.refs.addObjectGrid.setState({selectedItem:{}});}}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </VerticalPanel>
        )
    }

}