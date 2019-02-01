import {Component} from "react";
import CommonGrid from "../../baseComponent/grid/CommonGrid";
import React from "react";
import RepairAppRoomEditForm from "./RepairAppRoomEditForm";
import * as CommonUtils from "../../../utils/CommonUtils";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import addActionPng from '../../../media/data/gridAdd.png';
import deleteActionPng from '../../../media/data/gridDelete.png';
import editActionPng from '../../../media/data/gridEdit.png';

class RepairAppRoomGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomEditFormVisible:false,
            errors:[]
        };
        this.onChangeAction = props.onChangeAction;
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
        setTimeout(() => this.setState({roomEditFormVisible:true}), 0)
    }

    editRoomAction() {
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
            setTimeout(() => this.setState({roomEditFormVisible:true}), 0);
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
        return(
            <div>
                <div style={{width:'100%'}}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{width:'30px'}}>
                                    <img alt='' title={'Добавить запись'} onClick={() => this.addRoomAction()} src={addActionPng} style={{cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                                <td style={{width:'30px'}}>
                                    <img alt='' title={'Редактировать запись'} onClick={() => this.editRoomAction()} src={editActionPng} style={{cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                                <td style={{width:'30px'}}>
                                    <img alt='' title={'Удалить запись'} onClick={() => this.deleteRoomAction()} src={deleteActionPng} style={{cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{width:'100%',height:'2px',marginTop:'3px',backgroundColor:'#ddd'}}/>
                </div>
                <CommonGrid ref={'roomsGrid'}
                            gridData={this.props.parent && this.props.parent.state && this.props.parent.state.fields.rooms ? this.props.parent.state.fields.rooms : {}}
                            height={'150px'}/>
                <RepairAppRoomEditForm ref={'roomEditForm'} visible={this.state.roomEditFormVisible} okAction={(event) => this.changeRooms(event)} closeAction={() => {this.setState({roomEditFormVisible:false}); this.refs.roomsGrid.setState({selectedItem:{}});}}/>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </div>
        )
    }
}

export default RepairAppRoomGrid;