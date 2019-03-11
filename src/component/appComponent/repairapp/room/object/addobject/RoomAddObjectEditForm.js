import {Component} from "react";
import * as CommonUtils from "../../../../../../utils/CommonUtils";
import * as Const from "../../../../../../Const";
import CommonModal from "../../../../../baseComponent/modal/CommonModal";
import VerticalPanel from "../../../../../baseComponent/panel/VerticalPanel";
import React from "react";
import Label from "../../../../../baseComponent/field/Label";
import TextField from "../../../../../baseComponent/field/TextField";
import HorizontalPanel from "../../../../../baseComponent/panel/HorizontalPanel";
import DictField from "../../../../../baseComponent/field/DictField";
import DecimalField from "../../../../../baseComponent/field/DecimalField";
import IntegerField from "../../../../../baseComponent/field/IntegerField";
import Button from "../../../../../baseComponent/field/Button";
import ErrorModal from "../../../../../baseComponent/modal/ErrorModal";

export let fieldsObject = {
    id:'',
    name:'',
    type:'',
    firstSideMmSize:0,
    secondSideMmSize:0,
    area:0.00
};

export default class RoomAddObjectEditForm extends Component {

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
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({
                fields:{
                    ...this.state.fields,
                    id:responseData.params.newUuid
                }
            });
        }
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    handleChangeSize(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value);
        setTimeout(() => {
            if (this.state.fields.firstSideMmSize && this.state.fields.secondSideMmSize) {
                let areaM2 = (CommonUtils.strToInteger(this.state.fields.firstSideMmSize)/1000)*(CommonUtils.strToInteger(this.state.fields.secondSideMmSize)/1000);
                CommonUtils.commonHandleChange(this,'','area',areaM2.toFixed(2));
            }
        }, 0);
    }

    closeModal() {
        this.setState({
            errors: [],
            disabled:false,
            fields:fieldsObject
        });
        this.closeActionParent()
    }

    okAction() {
        let addObjectData = this.state.fields;
        let errors = [];

        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            setTimeout(() => this.okActionParent(addObjectData), 0);
            this.closeModal()
        }
    }

    chooseAddObjectType(selected){
        if (selected) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    type : selected.name
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    type : ''
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
                        <Label value={'Наименование'} width={'170px'}/>
                        <TextField disabled={formDisabled} width={'300px'} value={this.state.fields.name} onChange={(event) => this.handleChange(event.target.value,'name','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Тип'} width={'170px'}/>
                        <DictField width='300px'
                                   value={this.state.fields.type}
                                   maxLength={100}
                                   context={Const.ROOM_ADD_OBJECT}
                                   chooseDictAction={this.chooseAddObjectType.bind(this)}
                                   disabled={formDisabled}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Размер первой стороны(мм)'} width={'170px'}/>
                        <IntegerField disabled={formDisabled} width={'300px'} value={this.state.fields.firstSideMmSize} onChange={(value) => this.handleChangeSize(value,'firstSideMmSize','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Размер второй стороны(мм)'} width={'170px'}/>
                        <IntegerField disabled={formDisabled} width={'300px'} value={this.state.fields.secondSideMmSize} onChange={(value) => this.handleChangeSize(value,'secondSideMmSize','')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Площадь(м²)'} width={'170px'}/>
                        <IntegerField disabled={true} width={'300px'} value={this.state.fields.area} onChange={(value) => this.handleChange(value,'area','')}/>
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