import {Component} from "react";
import CommonGrid from "../../baseComponent/grid/CommonGrid";
import React from "react";
import RepairAppRoomEditForm from "./RepairAppRoomEditForm";
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import addActionPng from '../../../media/grid/gridAdd.png';
import deleteActionPng from '../../../media/grid/gridDelete.png';
import editActionPng from '../../../media/grid/gridEdit.png';
import viewActionPng from '../../../media/grid/gridView.png';
import CommonModal from "../../baseComponent/modal/CommonModal";

class RepairAppRoomGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomEditFormVisible:false,
            roomEditFormDisabled:false,
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

    addRoomAction() {
        this.refs.roomEditForm.setState({
            fields:{
                ...this.state.fields,
                common:{
                    entityId:'',
                    name:'',
                    area:''
                }
            }
        });
        setTimeout(() => this.setState({
            roomEditFormVisible:true,
            roomEditFormDisabled:false
        }), 0)
    }

    editRoomAction(disabled) {
        let roomObject = this.refs.roomsGrid.state.selectedItem;
        if (CommonUtils.objectIsEmpty(roomObject)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            this.refs.roomEditForm.setState({
                fields:{
                    ...this.state.fields,
                    common:roomObject
                }
            });
            setTimeout(() => this.setState({
                roomEditFormVisible:true,
                roomEditFormDisabled:disabled
            }), 0);
        }
    }

    deleteRoomAction() {
        let roomObject = this.refs.roomsGrid.state.selectedItem;
        if (CommonUtils.objectIsEmpty(roomObject)) {
            this.setState({errors:[{code:'',message:'Необходимо выбрать запись'}]});
        } else {
            let rooms = this.props.parent.state.fields.rooms;
            delete rooms[roomObject.entityId];
            this.props.parent.setState({
                fields:{
                    ...this.props.parent.state.fields,
                    rooms:rooms
                }
            });
        }
        this.onChangeAction()
    }

    changeRooms(room) {
        let rooms = this.props.parent.state.fields.rooms;
        rooms[room.entityId] = room;
        this.props.parent.setState({
            fields:{
                ...this.props.parent.state.fields,
                rooms:rooms
            }
        });
        this.refs.roomsGrid.setState({
            selectedItem:{}
        });
        this.onChangeAction()
    }

    render() {

        let gridDisabled = this.state.disabled;

        return(
            <div>
                <div style={{width:'100%'}}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={'gridActionTd'}>
                                    <div className={'gridActionDiv'}>
                                        <img onClick={gridDisabled ? null : () => this.addRoomAction()} title={'Добавить запись'}  alt={'Добавить запись'} src={addActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                                    </div>
                                </td>
                                <td className={'gridActionTd'}>
                                    <div className={'gridActionDiv'}>
                                        <img onClick={gridDisabled ? null : () => this.editRoomAction(false)} title={'Редактировать запись'}  alt={'Редактировать запись'} src={editActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                                    </div>
                                </td>
                                <td className={'gridActionTd'}>
                                    <div className={'gridActionDiv'}>
                                        <img onClick={gridDisabled ? null : () => this.deleteRoomAction()} title={'Удалить запись'}  alt={'Удалить запись'} src={deleteActionPng} className={gridDisabled ? 'gridActionImgDis' : 'gridActionImg'}/>
                                    </div>
                                </td>
                                <td className={'gridActionTd'}>
                                    <div className={'gridActionDiv'}>
                                        <img onClick={() => this.editRoomAction(true)} title={'Просмотреть запись'}  alt={'Просмотреть запись'} src={viewActionPng} className={'gridActionImg'}/>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{width:'100%',height:'2px',marginTop:'3px',backgroundColor:'#ddd'}}/>
                </div>
                <CommonGrid ref={'roomsGrid'}
                            gridData={this.props.parent && this.props.parent.state && this.props.parent.state.fields.rooms ? this.props.parent.state.fields.rooms : {}}
                            height={'150px'}/>
                <RepairAppRoomEditForm mainPageComp={this.props.mainPageComp} disabled={this.state.roomEditFormDisabled} ref={'roomEditForm'} visible={this.state.roomEditFormVisible} okAction={(event) => this.changeRooms(event)} closeAction={() => {this.setState({roomEditFormVisible:false}); this.refs.roomsGrid.setState({selectedItem:{}});}}/>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }
}

export default RepairAppRoomGrid;