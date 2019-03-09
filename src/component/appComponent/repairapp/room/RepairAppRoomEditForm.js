import {Component} from "react";
import * as CommonUtils from "../../../../utils/CommonUtils";
import * as Const from "../../../../Const";
import Button from "../../../baseComponent/field/Button";
import ErrorModal from "../../../baseComponent/modal/ErrorModal";
import CommonModal from "../../../baseComponent/modal/CommonModal";
import React from "react";
import DictField from "../../../baseComponent/field/DictField";
import Label from "../../../baseComponent/field/Label";
import HorizontalPanel from "../../../baseComponent/panel/HorizontalPanel";
import VerticalPanel from "../../../baseComponent/panel/VerticalPanel";
import DecimalField from "../../../baseComponent/field/DecimalField";
import Separator from "../../../baseComponent/field/Separator";
import RoomAddObjectGrid from "./object/RoomAddObjectGrid";
import RoomExcludeObjectGrid from "./object/RoomExcludeObjectGrid";

export let fieldsObject = {
    id:'',
    name:'',
    area:'',
    addObjectList:{},
    excludeObjectList:{}
};

export default class RepairAppRoomEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            disabled:false,
            fields:fieldsObject
        };

        this.closeActionParent = props.closeAction;
        this.okActionParent = props.okAction;
        this.okAction = this.okAction.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.setState({
                disabled:this.props.disabled
            });
            if (CommonUtils.objectIsEmpty(this.state.fields.id)) {
                setTimeout(() => this.getNewEntity(), 0);
            }
        }
    }

    async getNewEntity() {
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.COMMON,Const.COMMON_GEN_UUID,null);
        this.setState({
            fields:{
                ...this.state.fields,
                id:responseData.params.newUuid,
                area:0.00,
                addObjectList:{},
                excludeObjectList:{}
            }
        });
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    closeModal() {
        this.setState({
            errors: [],
            fields:fieldsObject
        });
        this.closeActionParent()
    }

    okAction() {
        let roomData = this.state.fields;
        let errors = [];
        if (!roomData.name){errors.push({code:'',message:'Необходимо заполнить тип помещения'})}
        if (!roomData.area){errors.push({code:'',message:'Необходимо заполнить площадь помещения'})}

        if (roomData.area) {
            let areaInNum = CommonUtils.strToBigDecimal(roomData.area);
            if (isNaN(areaInNum)) {
                errors.push({code:'',message:'Площадь должна быть в формате числа(12.34 или 12,34)'})
            } else {
                roomData.area = areaInNum.toString();
            }
        }

        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            setTimeout(() => this.okActionParent(roomData), 0);
            this.closeModal()
        }
    }

    chooseRoomType(selectedRoomType){
        if (selectedRoomType) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    name : selectedRoomType.name
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    name : ''
                }
            });
        }
    }

    render() {

        let formDisabled = this.state.disabled;

        return (
            <CommonModal paddingCloseCross={true} title={'Добавить/Редактировать/Просмотреть запись'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Тип помещения'} width={'120px'}/>
                        <DictField width='300px'
                                   value={this.state.fields.name}
                                   maxLength={100}
                                   context={Const.ROOM_TYPE}
                                   chooseDictAction={this.chooseRoomType.bind(this)}
                                   disabled={formDisabled}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Площадь'} width={'120px'}/>
                        <DecimalField disabled={formDisabled} width={'300px'} value={this.state.fields.area} onChange={(value) => this.handleChange(value,'area','')}/>
                    </HorizontalPanel>
                    <Separator text={'Объекты'}/>
                    <HorizontalPanel style={{width:'100%'}}>
                        <RoomAddObjectGrid mainPageComp={this.props.mainPageComp} disabled={this.state.disabled} parent={this} onChangeAction={() => null}/>
                    </HorizontalPanel>
                    <Separator text={'Объекты-исключения'}/>
                    <HorizontalPanel style={{width:'100%'}}>
                        <RoomExcludeObjectGrid mainPageComp={this.props.mainPageComp} disabled={this.state.disabled} parent={this} onChangeAction={() => null}/>
                    </HorizontalPanel>
                </VerticalPanel>
                <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                    <Button disabled={formDisabled} value="Ок" onClick={() => this.okAction()}/>
                    <Button value="Отмена" onClick={() => this.closeModal()}/>
                </div>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </CommonModal>
        )
    }
}