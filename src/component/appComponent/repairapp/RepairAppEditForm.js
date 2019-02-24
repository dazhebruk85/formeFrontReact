import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import { Tabs, Tab} from 'react-bootstrap';
import Button from './../../baseComponent/field/Button'
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import InfoModal from "../../baseComponent/modal/InfoModal";
import DictField from "../../baseComponent/field/DictField";
import RepairAppRoomGrid from "./RepairAppRoomGrid";
import Label from "../../baseComponent/field/Label";
import VerticalPanel from "../../baseComponent/panel/VerticalPanel";
import HorizontalPanel from "../../baseComponent/panel/HorizontalPanel";
import TextField from "../../baseComponent/field/TextField";
import DateField from "../../baseComponent/field/DateField";
import DecimalField from "../../baseComponent/field/DecimalField";
import TextAreaField from "../../baseComponent/field/TextAreaField";
import CheckBoxField from "../../baseComponent/field/CheckBoxField";
import Separator from "../../baseComponent/field/Separator";

class RepairAppEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            isLoading:false,
            successInfoMessages:[],
            editFormDisabled:false,
            fields:{
                common:{
                    entityId: '',
                    appNum:'',
                    appDate:undefined,
                    finalPriceForMeter:'0.00',
                    totalCost:'0.00',
                    totalArea:'0.00',
                    addOptionCost:'0.00',
                    clientUserId: '',
                    clientUserLogin: ''
                },
                basePackage:{
                    entityId:'',
                    name:'',
                    priceForMeter:''
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
                rooms:{}
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getEntityData = this.getEntityData.bind(this);
        this.saveEntityData = this.saveEntityData.bind(this);
        this.cnangeTotalArea = this.cnangeTotalArea.bind(this);
        this.changeTotalCost = this.changeTotalCost.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.entityId !== prevProps.entityId ) {
            this.setState({
                fields:{
                    ...this.state.fields,
                    common:{
                        ...this.state.fields.common,
                        entityId:this.props.entityId
                    }
                }
            });
        }
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            this.setState({
                editFormDisabled:this.props.disabled
            });
            setTimeout(() => this.getEntityData(), 0);
        }
    }

    async getEntityData() {
        if (this.state.fields.common.entityId) {
            //Редактирование анкеты
            this.setState({isLoading:true});
            let params = {entityId: this.state.fields.common.entityId};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_GET,params);
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({fields: responseData.params});
            }
        } else {
            //Новая анкета
            this.setState({isLoading:true});
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_NEW,{});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({fields: responseData.params});
            }
            this.setState({
                fields:{
                    ...this.state.fields,
                    common : {
                        ...this.state.fields.common,
                        appNum:'',
                        appDate: new Date(),
                        finalPriceForMeter:'0.00',
                        totalCost:'0.00',
                        totalArea:'0.00',
                        addOptionCost:'0.00'
                    }
                }});
            this.setState({isLoading:false});
        }
    }

    closeModal() {
        this.setState({
            errors:[],
            successInfoMessages:[],
            editFormDisabled:false,
            fields:{
                ...this.state.fields,
                common : {
                    ...this.state.fields.common,
                    entityId: '',
                    appNum:'',
                    appDate:undefined,
                    finalPriceForMeter:'0.00',
                    totalCost:'0.00',
                    totalArea:'0.00',
                    addOptionCost:'0.00',
                    clientUserId: '',
                    clientUserLogin: ''
                },
                basePackage : {
                    ...this.state.fields.basePackage,
                    entityId: '',
                    name: '',
                    priceForMeter: ''
                },
                realEstate : {
                    ...this.state.fields.realEstate,
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
                rooms:{}
            }
        });
        this.closeAction()
    }

    handleChange(value,fieldName,context) {
        CommonUtils.commonHandleChange(this,context,fieldName,value)
    }

    async saveEntityData() {
        let errors = [];
        if (!this.state.fields.basePackage.entityId) {errors.push({code:'',message:'Необходимо заполнить базовый пакет'})}
        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({isLoading:true});
            let params = this.state.fields;
            params['entityId'] = this.state.fields.common.entityId;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_SAVE,params);
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Данные анкеты сохранены'}]});
            }
        }
    }

    chooseBasePackage(selectedPackage) {
        if (selectedPackage) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    basePackage : selectedPackage,
                    common : {
                        ...this.state.fields.common,
                        finalPriceForMeter : selectedPackage.priceForMeter
                    }
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    basePackage : {
                        ...this.state.fields.basePackage,
                        entityId: '',
                        name: '',
                        priceForMeter: ''
                    },
                    common : {
                        ...this.state.fields.common,
                        finalPriceForMeter : '0.00'
                    }
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
                    common : {
                        ...this.state.fields.common,
                        clientUserId : selectedUser.entityId,
                        clientUserLogin : selectedUser.login
                    }
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    common : {
                        ...this.state.fields.common,
                        clientUserId : '',
                        clientUserLogin : ''
                    }
                }
            });
        }
    }

    cnangeTotalArea() {
        let totalArea = 0.00;
        let rooms = this.state.fields.rooms;
        if (rooms && Object.keys(rooms).length > 1) {
            for (let key in rooms) {
                if (key === 'headers') continue;
                let room = rooms[key];
                totalArea = totalArea + parseFloat(room.area)
            }
        }
        this.setState({
            fields:{
                ...this.state.fields,
                common:{
                    ...this.state.fields.common,
                    totalArea:totalArea.toFixed(2)
                }
            }
        });
    }

    changeTotalCost() {
        let totalCost = 0.00;
        let totalArea = this.state.fields.common.totalArea
        let finalPriceForMeter = this.state.fields.common.finalPriceForMeter
        if (totalArea && finalPriceForMeter) {
            totalCost = totalArea*finalPriceForMeter;
        }
        this.setState({
            fields:{
                ...this.state.fields,
                common:{
                    ...this.state.fields.common,
                    totalCost:totalCost.toFixed(2)
                }
            }
        });
    }

    render() {
        return(
            <CommonModal loading={this.state.isLoading} title={'Анкета'} visible={this.props.visible} style={{width:'800px'}} closeAction={() => this.closeModal()}>
                <VerticalPanel>
                    <HorizontalPanel>
                        <Label value={'Номер'} width={'70px'}/>
                        <TextField disabled={true} width={'120px'} value={this.state.fields.common.appNum} onChange={(event) => this.handleChange(event.target.value,'appNum','common')}/>
                        <Label value={'Дата'} width={'70px'}/>
                        <DateField disabled={true} width={'120px'} value={this.state.fields.common.appDate} onChange={(date) => this.handleChange(date,'appDate','common')}/>
                        <Label value={'Базовый пакет'} width={'120px'}/>
                        <DictField width='290px'
                                   value={this.state.fields.basePackage.name}
                                   maxLength={100}
                                   context={Const.BASE_PACKAGE_CONTEXT}
                                   chooseDictAction={this.chooseBasePackage.bind(this)}
                                   disabled={this.state.editFormDisabled}/>
                    </HorizontalPanel>
                    <HorizontalPanel>
                        <Label value={'Клиент'} width={'70px'}/>
                        <DictField width='310px'
                                   value={this.state.fields.common.clientUserLogin}
                                   maxLength={100}
                                   context={Const.USER_CONTEXT}
                                   chooseDictAction={this.chooseClientUser.bind(this)}
                                   dictFilter={{'RAEDictFilter_userRole_systemName_eq':'client'}}
                                   disabled={this.state.editFormDisabled}/>
                    </HorizontalPanel>
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" style={{height:'470px',width:'100%'}}>
                        <Tab eventKey={1} title="Объект" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd'}}>
                            <VerticalPanel style={{width:'100%',paddingLeft:'5px',paddingRight:'5px'}}>
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
                                    <RepairAppRoomGrid mainPageComp={this.props.mainPageComp} disabled={this.state.editFormDisabled} parent={this} onChangeAction={() => {setTimeout(() => this.cnangeTotalArea(), 0); setTimeout(() => this.changeTotalCost(), 0);}}/>
                                </HorizontalPanel>
                                <Separator text={'Ограничения'}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Отсутствие контейнера для строительного мусора' checked={this.state.fields.realEstate.trashCanNotExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanNotExist','realEstate')}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Отсутствие пассажирского лифта' checked={this.state.fields.realEstate.passLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'passLiftNotExist','realEstate')}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Отсутствие грузового лифта' checked={this.state.fields.realEstate.serviceLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'serviceLiftNotExist','realEstate')}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Ограничения по высоте борта' checked={this.state.fields.realEstate.heightRestrictExist} onChange={(event) => this.handleChange(event.target.checked,'heightRestrictExist','realEstate')}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Требуется пронос материала от паркинга до подъезда' checked={this.state.fields.realEstate.needCarryFromParkToEnt} onChange={(event) => this.handleChange(event.target.checked,'needCarryFromParkToEnt','realEstate')}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Требуется пронос материала на этаж' checked={this.state.fields.realEstate.needCarryToFloor} onChange={(event) => this.handleChange(event.target.checked,'needCarryToFloor','realEstate')}/>
                                <CheckBoxField disabled={this.state.editFormDisabled} text='Требуется разрешение УК на допуск рабочих' checked={this.state.fields.realEstate.needUkAccept} onChange={(event) => this.handleChange(event.target.checked,'needUkAccept','realEstate')}/>
                            </VerticalPanel>
                          </Tab>
                        <Tab eventKey={2} title="Демонтаж" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Демонтаж
                        </Tab>
                        <Tab eventKey={3} title="Монтаж" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Монтаж
                        </Tab>
                        <Tab eventKey={4} title="Полы" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Полы
                        </Tab>
                        <Tab eventKey={5} title="Стены" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Стены
                        </Tab>
                        <Tab eventKey={6} title="ХГВС" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            ХГВС
                        </Tab>
                        <Tab eventKey={7} title="Электрика" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Электрика
                        </Tab>
                        <Tab eventKey={8} title="Сантехника" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Электрика
                        </Tab>
                        <Tab eventKey={9} title="Керамическая плитка" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Электрика
                        </Tab>
                        <Tab eventKey={11} title="Двери" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Двери
                        </Tab>
                        <Tab eventKey={12} title="Балкон" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Балкон
                        </Tab>
                        <Tab eventKey={10} title="Потолки, подоконники, откосы" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Потолки, подоконники, откосы
                        </Tab>
                        <Tab eventKey={13} title="Прочие работы" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                            Прочие работы
                        </Tab>
                    </Tabs>
                    <HorizontalPanel style={{width:'100%'}}>
                        <VerticalPanel>
                            <Label value={'Цена за м²'} width={'130px'}/>
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.common.finalPriceForMeter} onChange={(event) => this.handleChange(event.target.value,'finalPriceForMeter','common')}/>
                        </VerticalPanel>
                        <VerticalPanel>
                            <Label value={'Общая площадь'} width={'130px'} />
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.common.totalArea} onChange={(event) => this.handleChange(event.target.value,'totalArea','common')}/>
                        </VerticalPanel>
                        <VerticalPanel>
                            <Label value={'Cтоимость'} width={'130px'}/>
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.common.totalCost} onChange={(event) => this.handleChange(event,'totalCost','common')}/>
                        </VerticalPanel>
                        <VerticalPanel>
                            <Label value={'Доп. опции'} width={'130px'}/>
                            <DecimalField disabled={true} width={'140px'} value={this.state.fields.common.addOptionCost} onChange={(event) => this.handleChange(event,'addOptionCost','common')}/>
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