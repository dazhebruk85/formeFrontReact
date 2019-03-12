import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import Button from './../../baseComponent/field/Button'
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import InfoModal from "../../baseComponent/modal/InfoModal";
import DictField from "../../baseComponent/field/DictField";
import RepairAppRoomGrid from "./room/RepairAppRoomGrid";
import Label from "../../baseComponent/field/Label";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import TextField from "../../baseComponent/field/TextField";
import DateField from "../../baseComponent/field/DateField";
import DecimalField from "../../baseComponent/field/DecimalField";
import TextAreaField from "../../baseComponent/field/TextAreaField";
import CheckBoxField from "../../baseComponent/field/CheckBoxField";
import Separator from "../../baseComponent/field/Separator";

let fieldsObject = {
    id:'',
    appDate:new Date(),
    appNum:'',
    finalPriceForMeter:0,
    totalArea:0,
    totalCost:0,
    addOptionCost:0,
    clientUser:{
        id:'',
        login:''
    },
    basePackage:{
        id:'',
        name:'',
        priceForMeter:0
    },
    realEstate:{
        address:'',
        entranceNum:'',
        floor:'',
        trashCanNotExist:false,
        passLiftNotExist:false,
        serviceLiftNotExist:false,
        heightRestrictExist:false,
        needCarryFromParkToEnt:false,
        needCarryToFloor:false,
        needUkAccept:false
    },
    roomList:{}
};

class RepairAppEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            isLoading:false,
            successInfoMessages:[],
            editFormDisabled:false,
            fields:fieldsObject
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getEntityData = this.getEntityData.bind(this);
        this.saveEntityData = this.saveEntityData.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.setState({
                editFormDisabled:this.props.disabled
            });
            setTimeout(() => this.getEntityData(), 0);
        }
    }

    async getEntityData() {
        this.setState({isLoading:true});
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP,this.props.entityId ? Const.GET_ACTION : Const.NEW_ACTION,{id:this.props.entityId});
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({fields: responseData.entity});
        }
    }

    closeModal() {
        this.setState({
            errors:[],
            successInfoMessages:[],
            editFormDisabled:false,
            fields:fieldsObject
        });
        this.closeAction()
    }

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    async saveEntityData() {
        this.setState({isLoading:true});
        let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP,Const.SAVE_ACTION,{id:this.state.fields.id},JSON.stringify(this.state.fields));
        this.setState({isLoading:false});
        if (responseData.errors.length > 0) {
            this.setState({errors: responseData.errors});
        } else {
            this.setState({successInfoMessages: [{code:'INFO',message:'Данные анкеты сохранены'}]});
        }
    }

    chooseBasePackage(selectedPackage) {
        if (selectedPackage) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    basePackage : selectedPackage,
                    finalPriceForMeter : selectedPackage.priceForMeter
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    basePackage:{
                        id:'',
                        name:'',
                        priceForMeter:0
                    },
                    finalPriceForMeter:0
                }
            });
        }
        setTimeout(() => this.changeTotalCost(), 0);
    }

    chooseClientUser(selectedUser) {
        if (selectedUser) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    clientUser:selectedUser
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    clientUser:{
                        id:'',
                        login:''
                    }
                }
            });
        }
    }

    cnangeTotalArea() {
        let totalArea = 0.00;
        let rooms = this.state.fields.roomList.list;
        for (let index in rooms) {
            totalArea = totalArea + parseFloat(rooms[index].area)
        }
        this.setState({
            fields:{
                ...this.state.fields,
                totalArea:totalArea.toFixed(2)
            }
        });
    }

    changeTotalCost() {
        let totalCost = 0.00;
        let totalArea = this.state.fields.totalArea;
        let finalPriceForMeter = this.state.fields.finalPriceForMeter;
        if (totalArea && finalPriceForMeter) {
            totalCost = totalArea*finalPriceForMeter;
        }
        this.setState({
            fields:{
                ...this.state.fields,
                totalCost:totalCost.toFixed(2)
            }
        });
    }

    render() {
        return(
            <CommonModal loading={this.state.isLoading} title={'Анкета'} visible={this.props.visible} style={{width:'800px'}} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Номер'} width={'70px'}/>
                        <TextField disabled={true} width={'120px'} value={this.state.fields.appNum} onChange={(event) => this.handleChange(event.target.value,'appNum','')}/>
                        <Label value={'Дата'} width={'70px'}/>
                        <DateField disabled={true} width={'120px'} value={this.state.fields.appDate} onChange={(date) => this.handleChange(date,'appDate','')}/>
                        <Label value={'Базовый пакет'} width={'120px'}/>
                        <DictField width='290px'
                                   value={this.state.fields.basePackage.name}
                                   maxLength={100}
                                   context={Const.BASE_PACKAGE}
                                   chooseDictAction={this.chooseBasePackage.bind(this)}
                                   disabled={this.state.editFormDisabled}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Клиент'} width={'70px'}/>
                        <DictField width='310px'
                                   value={this.state.fields.clientUser.login}
                                   maxLength={100}
                                   context={Const.USER}
                                   chooseDictAction={this.chooseClientUser.bind(this)}
                                   dictFilter={{'RAEDictFilter_userRole_systemName_eq':'client'}}
                                   disabled={this.state.editFormDisabled}/>
                    </HorizontalPanel>
                    <HorizontalPanel style={{marginTop:'5px',width:'100%'}}>
                        <Label value={'Адрес'} width={'70px'}/>
                        <TextAreaField disabled={this.state.editFormDisabled} style={{resize:'none',height:'50px'}} width={'100%'} value={this.state.fields.realEstate.address} onChange={(event) => this.handleChange(event.target.value,'address','realEstate')}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Подъезд'} width={'70px'}/>
                        <TextField disabled={this.state.editFormDisabled} width={'150px'} value={this.state.fields.realEstate.entranceNum} onChange={(event) => this.handleChange(event.target.value,'entranceNum','realEstate')} maxLength={10}/>
                        <Label value={'Этаж'} width={'60px'}/>
                        <TextField disabled={this.state.editFormDisabled} width={'150px'} value={this.state.fields.realEstate.floor} onChange={(event) => this.handleChange(event.target.value, 'floor','realEstate')} maxLength={10}/>
                    </HorizontalPanel>
                    <Separator text={'Помещения для ремонта'}/>
                    <HorizontalPanel style={{width:'100%'}}>
                        <RepairAppRoomGrid mainPageComp={this.props.mainPageComp} disabled={this.state.editFormDisabled} parent={this}/>
                    </HorizontalPanel>
                    <Separator text={'Ограничения'}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Отсутствие контейнера для строительного мусора' checked={this.state.fields.realEstate.trashCanNotExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanNotExist','realEstate')}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Отсутствие пассажирского лифта' checked={this.state.fields.realEstate.passLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'passLiftNotExist','realEstate')}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Отсутствие грузового лифта' checked={this.state.fields.realEstate.serviceLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'serviceLiftNotExist','realEstate')}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Ограничения по высоте борта' checked={this.state.fields.realEstate.heightRestrictExist} onChange={(event) => this.handleChange(event.target.checked,'heightRestrictExist','realEstate')}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Требуется пронос материала от паркинга до подъезда' checked={this.state.fields.realEstate.needCarryFromParkToEnt} onChange={(event) => this.handleChange(event.target.checked,'needCarryFromParkToEnt','realEstate')}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Требуется пронос материала на этаж' checked={this.state.fields.realEstate.needCarryToFloor} onChange={(event) => this.handleChange(event.target.checked,'needCarryToFloor','realEstate')}/>
                    <CheckBoxField disabled={this.state.editFormDisabled} text='Требуется разрешение УК на допуск рабочих' checked={this.state.fields.realEstate.needUkAccept} onChange={(event) => this.handleChange(event.target.checked,'needUkAccept','realEstate')}/>
                    <HorizontalPanel style={{width:'100%'}}>
                        <VerticalPanel>
                            <Label value={'Цена за м²'} width={'130px'}/>
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.finalPriceForMeter} onChange={(value) => this.handleChange(value,'finalPriceForMeter','')}/>
                        </VerticalPanel>
                        <VerticalPanel>
                            <Label value={'Общая площадь'} width={'130px'} />
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.totalArea} onChange={(value) => this.handleChange(value,'totalArea','')}/>
                        </VerticalPanel>
                        <VerticalPanel>
                            <Label value={'Cтоимость'} width={'130px'}/>
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.totalCost} onChange={(value) => this.handleChange(value,'totalCost','')}/>
                        </VerticalPanel>
                        <VerticalPanel>
                            <Label value={'Доп. опции'} width={'130px'}/>
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.addOptionCost} onChange={(value) => this.handleChange(value,'addOptionCost','')}/>
                        </VerticalPanel>
                    </HorizontalPanel>
                    <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                        <Button disabled={this.state.editFormDisabled} value="Ок" onClick={() => this.saveEntityData()}/>
                        <Button value="Отмена" onClick={() => this.closeModal()}/>
                    </div>
                </VerticalPanel>
                <ErrorModal mainPageComp={this.props.mainPageComp} errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages: []}); this.closeModal()}}/>
            </CommonModal>
        )
    }
}

export default RepairAppEditForm;