import {Component} from "react";
import * as CommonUtils from "../../../utils/CommonUtils";
import * as Const from "../../../Const";
import cookie from "react-cookies";
import Field from "../../baseComponent/field/Field";
import Button from "../../baseComponent/field/Button";
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import CommonModal from "../../baseComponent/modal/CommonModal";
import React from "react";
import DictField from "../../baseComponent/field/DictField";

class RepairAppRoomEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            disabled:false,
            fields:{
                common:{
                    entityId:'',
                    name:'',
                    area:''
                }
            }
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
            if (CommonUtils.objectIsEmpty(this.state.fields.common.entityId)) {
                setTimeout(() => this.getNewUuid(), 0);
            }
        }
    }

    async getNewUuid() {
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.GEN_UUID_CONTEXT,'',null,cookie.load('sessionId'));
        this.setState({
            fields:{
                ...this.state.fields,
                common : {
                    ...this.state.fields.common,
                    entityId:responseData.params.newUuid,
                    name:'',
                    area:''
                }
            }
        });
    }

    handleChange(value, fieldName, context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    closeModal() {
        this.setState({
            errors: [],
            fields:{
                ...this.state.fields,
                common:{
                    entityId:'',
                    name:'',
                    area:''
                }
            }
        });
        this.closeActionParent()
    }

    okAction() {
        let roomData = this.state.fields.common;
        let errors = [];
        if (!roomData.name){errors.push({code:'',message:'Необходимо заполнить тип помещения'})}
        if (!roomData.area){errors.push({code:'',message:'Необходимо заполнить площадь помещения'})}

        if (roomData.area) {
            let areaInNum = CommonUtils.strToBigDecimal(roomData.area)
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
                    common : {
                        ...this.state.fields.common,
                        name : selectedRoomType.name
                    }
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    common : {
                        ...this.state.fields.common,
                        name : ''
                    }
                }
            });
        }
    }

    render() {

        let formDisabled = this.state.disabled;

        return (
            <CommonModal paddingCloseCross={true} title={'Добавить/Редактировать/Просмотреть запись'} visible={this.props.visible} style={{width:'540px'}} closeAction={() => this.closeModal()}>
                <div>
                    <div className="form-horizontal">
                        <DictField labelWidth='150px'
                                   fieldWidth='300px'
                                   label='Тип помещения'
                                   type={Const.TEXTFIELD}
                                   value={this.state.fields.common.name}
                                   placeholder=''
                                   maxLength={100}
                                   context={Const.ROOM_TYPE_CONTEXT}
                                   chooseDictAction={this.chooseRoomType.bind(this)}
                                   disabled={formDisabled}/>
                        <Field disabled={formDisabled} labelWidth='150px' fieldWidth='300px' label='Площадь' type={Const.DECIMALFIELD} value={this.state.fields.common.area} onChange={(event) => this.handleChange(event.target.value,'area','common')} maxLength={20}/>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <Button value="Ок" onClick={() => this.okAction()}/>
                            <Button value="Отмена" onClick={() => this.closeModal()}/>
                        </div>
                    </div>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
            </CommonModal>
        )
    }
}

export default RepairAppRoomEditForm;