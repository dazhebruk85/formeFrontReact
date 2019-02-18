import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import { Tabs, Tab} from 'react-bootstrap';
import Button from './../../baseComponent/field/Button'
import Field from '../../baseComponent/field/Field'
import CollapsePanel from './../../baseComponent/panel/CollapsePanel'
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import InfoModal from "../../baseComponent/modal/InfoModal";
import DictField from "../../baseComponent/field/DictField";
import RepairAppRoomGrid from "./RepairAppRoomGrid";

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
            <CommonModal loading={this.state.isLoading} title={'Анкета'} visible={this.props.visible} style={{width:'1000px'}} closeAction={() => this.closeModal()}>
                <div>
                    <form className="form-horizontal">
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <Field disabled={true} labelWidth='80px' fieldWidth='150px' label='Номер' type={Const.TEXTFIELD} value={this.state.fields.common.appNum} onChange={(event) => this.handleChange(event.target.value,'appNum','common')} maxLength={255}/>
                                </td>
                                <td>
                                    <Field disabled={true} labelWidth='80px' fieldWidth='150px' label='Дата' type={Const.DATEPICKER} value={this.state.fields.common.appDate} onChange={(date) => this.handleChange(date,'appDate','common')}/>
                                </td>
                                <td>
                                    <DictField labelWidth='150px'
                                               fieldWidth='235px'
                                               label='Базовый пакет'
                                               type={Const.TEXTFIELD}
                                               value={this.state.fields.basePackage.name}
                                               placeholder=''
                                               maxLength={100}
                                               context={Const.BASE_PACKAGE_CONTEXT}
                                               chooseDictAction={this.chooseBasePackage.bind(this)}
                                               disabled={this.state.editFormDisabled}/>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <DictField labelWidth='80px'
                                               fieldWidth='350px'
                                               label='Клиент'
                                               type={Const.TEXTFIELD}
                                               value={this.state.fields.common.clientUserLogin}
                                               placeholder=''
                                               maxLength={100}
                                               context={Const.USER_CONTEXT}
                                               chooseDictAction={this.chooseClientUser.bind(this)}
                                               dictFilter={{'RAEDictFilter_userRole_systemName_eq':'client'}}
                                               disabled={this.state.editFormDisabled}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" style={{height:'500px'}}>
                            <Tab eventKey={1} title="Объект" style={{width:'100%',height:'420px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                <div style={{paddingTop:'10px'}}>
                                    <Field disabled={this.state.editFormDisabled} formStyle={{marginRight:'0px'}} fieldWidth='862px' style={{resize:'none',height:'50px'}} labelWidth='80px' label='Адрес' maxLength={255} type={Const.TEXTAREA} value={this.state.fields.realEstate.address} onChange={(event) => this.handleChange(event.target.value,'address','realEstate')}/>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Field disabled={this.state.editFormDisabled} labelWidth='80px' fieldWidth='150px' label='Подъезд' maxLength={10} type={Const.TEXTFIELD} value={this.state.fields.realEstate.entranceNum} onChange={(event) => this.handleChange(event.target.value,'entranceNum','realEstate')}/>
                                            </td>
                                            <td>
                                                <Field disabled={this.state.editFormDisabled} labelWidth='80px' fieldWidth='150px' label='Этаж' maxLength={10} type={Const.TEXTFIELD} value={this.state.fields.realEstate.floor} onChange={(event) => this.handleChange(event.target.value, 'floor','realEstate')}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <CollapsePanel style={{width:'99%',marginBottom:'10px'}} title={'Помещения для ремонта'}>
                                        <RepairAppRoomGrid disabled={this.state.editFormDisabled} parent={this} onChangeAction={() => {setTimeout(() => this.cnangeTotalArea(), 0); setTimeout(() => this.changeTotalCost(), 0);}}/>
                                    </CollapsePanel>
                                    <CollapsePanel style={{width:'99%',marginBottom:'10px'}} title={'Ограничения'}>
                                        <div style={{height:'200px',overflowY:'auto'}}>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Отсутствие контейнера для строительного мусора' type={Const.CHECKBOX} checked={this.state.fields.realEstate.trashCanNotExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanNotExist','realEstate')}/>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Отсутствие пассажирского лифта' type={Const.CHECKBOX} checked={this.state.fields.realEstate.passLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'passLiftNotExist','realEstate')}/>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Отсутствие грузового лифта' type={Const.CHECKBOX} checked={this.state.fields.realEstate.serviceLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'serviceLiftNotExist','realEstate')}/>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Ограничения по высоте борта' type={Const.CHECKBOX} checked={this.state.fields.realEstate.heightRestrictExist} onChange={(event) => this.handleChange(event.target.checked,'heightRestrictExist','realEstate')}/>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Требуется пронос материала от паркинга до подъезда' type={Const.CHECKBOX} checked={this.state.fields.realEstate.needCarryFromParkToEnt} onChange={(event) => this.handleChange(event.target.checked,'needCarryFromParkToEnt','realEstate')}/>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Требуется пронос материала на этаж' type={Const.CHECKBOX} checked={this.state.fields.realEstate.needCarryToFloor} onChange={(event) => this.handleChange(event.target.checked,'needCarryToFloor','realEstate')}/>
                                            <Field disabled={this.state.editFormDisabled} labelWidth='400px' label='Требуется разрешение УК на допуск рабочих' type={Const.CHECKBOX} checked={this.state.fields.realEstate.needUkAccept} onChange={(event) => this.handleChange(event.target.checked,'needUkAccept','realEstate')}/>
                                        </div>
                                    </CollapsePanel>
                                </div>
                            </Tab>
                            <Tab eventKey={2} title="Демонтаж" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Демонтаж
                            </Tab>
                            <Tab eventKey={3} title="Монтаж" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Монтаж
                            </Tab>
                            <Tab eventKey={4} title="Полы" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Полы
                            </Tab>
                            <Tab eventKey={5} title="Стены" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Стены
                            </Tab>
                            <Tab eventKey={6} title="ХГВС" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                ХГВС
                            </Tab>
                            <Tab eventKey={7} title="Электрика" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Электрика
                            </Tab>
                            <Tab eventKey={8} title="Сантехника" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Электрика
                            </Tab>
                            <Tab eventKey={9} title="Керамическая плитка" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Электрика
                            </Tab>
                            <Tab eventKey={11} title="Двери" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Двери
                            </Tab>
                            <Tab eventKey={12} title="Балкон" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Балкон
                            </Tab>
                            <Tab eventKey={10} title="Потолки, подоконники, откосы" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Потолки, подоконники, откосы
                            </Tab>
                            <Tab eventKey={13} title="Прочие работы" style={{width:'100%',height:'520px',overflowY:'auto',borderRight:'1px solid #ddd',borderBottom:'1px solid #ddd',borderLeft:'1px solid #ddd',paddingLeft:'10px'}}>
                                Прочие работы
                            </Tab>
                        </Tabs>
                        <table style={{marginLeft:'10px',width:'95%'}}>
                            <tbody>
                            <tr>
                                <td>
                                    <label style={{width:'130px',textAlign:'left',paddingLeft:'0px'}} className="control-label col-sm-2">Цена за м²</label>
                                </td>
                                <td>
                                    <label style={{width:'130px',textAlign:'left',paddingLeft:'0px'}} className="control-label col-sm-2">Общая площадь</label>
                                </td>
                                <td>
                                    <label style={{width:'130px',textAlign:'left',paddingLeft:'0px'}} className="control-label col-sm-2">Cтоимость</label>
                                </td>
                                <td>
                                    <label style={{width:'130px',textAlign:'left',paddingLeft:'0px'}} className="control-label col-sm-2">Доп. опции</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Field style={{paddingLeft:'0px'}} labelWidth='0px' disabled={true} fieldWidth='140px' type={Const.DECIMALFIELD} value={this.state.fields.common.finalPriceForMeter} onChange={(event) => this.handleChange(event.target.value,'finalPriceForMeter','common')}/>
                                </td>
                                <td>
                                    <Field style={{paddingLeft:'0px'}} labelWidth='0px' disabled={true} fieldWidth='140px' type={Const.DECIMALFIELD} value={this.state.fields.common.totalArea} onChange={(event) => this.handleChange(event.target.value,'totalArea','common')}/>
                                </td>
                                <td>
                                    <Field style={{paddingLeft:'0px'}} labelWidth='0px' disabled={true} fieldWidth='140px' type={Const.DECIMALFIELD} value={this.state.fields.common.totalCost} onChange={(event) => this.handleChange(event,'totalCost','common')}/>
                                </td>
                                <td>
                                    <Field style={{paddingLeft:'0px'}} labelWidth='0px' disabled={true} fieldWidth='140px' type={Const.DECIMALFIELD} value={this.state.fields.common.addOptionCost} onChange={(event) => this.handleChange(event,'addOptionCost','common')}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <Button disabled={this.state.editFormDisabled} value="Ок" onClick={() => this.saveEntityData()}/>
                            <Button value="Отмена" onClick={() => this.closeModal()}/>
                        </div>
                    </form>
                </div>
                <ErrorModal errors={this.state.errors} closeAction={() => this.setState({errors:[]})}/>
                <InfoModal popupData={this.state.successInfoMessages} closeAction={() => {this.setState({successInfoMessages: []}); this.closeModal()}}/>
            </CommonModal>
        )
    }
}

export default RepairAppEditForm;