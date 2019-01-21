import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as Const from '../../../Const';
import * as CommonUtils from "../../../utils/CommonUtils";
import cookie from 'react-cookies';
import { Tabs, Tab} from 'react-bootstrap';
import Button from './../../baseComponent/field/Button'
import Field from '../../baseComponent/field/Field'
import CollapsePanel from './../../baseComponent/panel/CollapsePanel'
import ErrorModal from "../../baseComponent/modal/ErrorModal";
import InfoModal from "../../baseComponent/modal/InfoModal";
import DictField from "../../baseComponent/field/DictField";

class RepairAppEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            isLoading:false,
            closeAction:props.closeAction,
            successInfoMessages:[],
            restrictionsOpen:true,
            fields:{
                common:{
                    entityId: '',
                    appNum:'',
                    appDate:undefined,
                    finalPriceForMeter:'0.00',
                    totalCost:'0.00',
                    addOptionCost:'0.00'
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
        this.getRepairAppData = this.getRepairAppData.bind(this);
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
            setTimeout(() => this.getRepairAppData(), 0);
        }
    }

    async getRepairAppData() {
        if (this.state.fields.common.entityId) {
            //Редактирование анкеты
            this.setState({isLoading:true});
            let params = {entityId: this.state.fields.common.entityId};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_GET,params,cookie.load('sessionId'));
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({fields: responseData.params});
            }
        } else {
            //Новая анкета
            this.setState({isLoading:true});
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_NEW,{},cookie.load('sessionId'));
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
                        addOptionCost:'0.00'
                    }
                }});
            this.setState({isLoading:false});
        }
    }

    closeModal() {
        this.setState({
            errors: [],
            successInfoMessages: [],
            fields:{
                ...this.state.fields,
                common : {
                    ...this.state.fields.common,
                    entityId: '',
                    appNum:'',
                    appDate:undefined,
                    finalPriceForMeter:'0.00',
                    totalCost:'0.00',
                    addOptionCost:'0.00'
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

    async saveRepairAppData() {
        let errors = [];
        if (!this.state.fields.basePackage.entityId) {
            errors.push({code:'',message:'Необходимо заполнить базовый пакет'})
        }

        if (errors.length > 0) {
            this.setState({
                errors: errors
            });
        } else {
            this.setState({isLoading:true});
            let params = this.state.fields;
            params['entityId'] = this.state.fields.common.entityId;
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_SAVE,params,cookie.load('sessionId'));
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setState({successInfoMessages: [{code:'INFO',message:'Данные анкеты сохранены'}]});
            }
        }
    }

    chooseBasePackage(selectedPackage){
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

    }

    render() {
        return(
            <CommonModal loading={this.state.isLoading} title={'Анкета'} visible={this.props.visible} style={{width:'800px'}} closeAction={() => this.closeModal()}>
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
                                               fieldWidth='215px'
                                               label='Базовый пакет'
                                               type={Const.TEXTFIELD}
                                               value={this.state.fields.basePackage.name}
                                               placeholder=''
                                               maxLength={100}
                                               context={Const.BASE_PACKAGE_CONTEXT}
                                               chooseDictAction={this.chooseBasePackage.bind(this)}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" style={{height:'490px',marginRight:'20px'}}>
                            <Tab eventKey={1} title="Объект" style={{width:'100%'}}>
                                <div style={{paddingTop:'10px'}}>
                                    <Field style={{resize:'none',height:'50px'}} labelWidth='80px' label='Адрес' maxLength={255} type={Const.TEXTAREA} value={this.state.fields.realEstate.address} onChange={(event) => this.handleChange(event.target.value,'address','realEstate')}/>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Field labelWidth='80px' fieldWidth='150px' label='Подъезд' maxLength={10} type={Const.TEXTFIELD} value={this.state.fields.realEstate.entranceNum} onChange={(event) => this.handleChange(event.target.value,'entranceNum','realEstate')}/>
                                            </td>
                                            <td>
                                                <Field labelWidth='80px' fieldWidth='150px' label='Этаж' maxLength={10} type={Const.TEXTFIELD} value={this.state.fields.realEstate.floor} onChange={(event) => this.handleChange(event.target.value, 'floor','realEstate')}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <CollapsePanel title={'Ограничения'}>
                                        <Field labelWidth='400px' label='Отсутствие контейнера для строительного мусора' type={Const.CHECKBOX} checked={this.state.fields.realEstate.trashCanNotExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanNotExist','realEstate')}/>
                                        <Field labelWidth='400px' label='Отсутствие пассажирского лифта' type={Const.CHECKBOX} checked={this.state.fields.realEstate.passLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'passLiftNotExist','realEstate')}/>
                                        <Field labelWidth='400px' label='Отсутствие грузового лифта' type={Const.CHECKBOX} checked={this.state.fields.realEstate.serviceLiftNotExist} onChange={(event) => this.handleChange(event.target.checked,'serviceLiftNotExist','realEstate')}/>
                                        <Field labelWidth='400px' label='Ограничения по высоте борта' type={Const.CHECKBOX} checked={this.state.fields.realEstate.heightRestrictExist} onChange={(event) => this.handleChange(event.target.checked,'heightRestrictExist','realEstate')}/>
                                        <Field labelWidth='400px' label='Требуется пронос материала от паркинга до подъезда' type={Const.CHECKBOX} checked={this.state.fields.realEstate.needCarryFromParkToEnt} onChange={(event) => this.handleChange(event.target.checked,'needCarryFromParkToEnt','realEstate')}/>
                                        <Field labelWidth='400px' label='Требуется пронос материала на этаж' type={Const.CHECKBOX} checked={this.state.fields.realEstate.needCarryToFloor} onChange={(event) => this.handleChange(event.target.checked,'needCarryToFloor','realEstate')}/>
                                        <Field labelWidth='400px' label='Требуется разрешение УК на допуск рабочих' type={Const.CHECKBOX} checked={this.state.fields.realEstate.needUkAccept} onChange={(event) => this.handleChange(event.target.checked,'needUkAccept','realEstate')}/>
                                    </CollapsePanel>

                                </div>
                            </Tab>
                            <Tab eventKey={2} title="Полы" style={{width:'100%'}}>
                                Tab 2 content
                            </Tab>
                            <Tab eventKey={3} title="Стены" style={{width:'100%'}}>
                                Tab 3 content
                            </Tab>
                        </Tabs>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <Field labelWidth='120px' disabled={true} fieldWidth='150px' label='Цена за м²' type={Const.DECIMALFIELD} value={this.state.fields.common.finalPriceForMeter} onChange={(event) => this.handleChange(event.target.value,'finalPriceForMeter','common')}/>
                                </td>
                                <td>
                                    <Field labelWidth='120px' disabled={true} fieldWidth='150px' label='Cтоимость' type={Const.DECIMALFIELD} value={this.state.fields.common.totalCost} onChange={(event) => this.handleChange(event,'totalCost','common')}/>
                                </td>
                                <td>
                                    <Field labelWidth='120px' disabled={true} fieldWidth='150px' label='Доп. опции' type={Const.DECIMALFIELD} value={this.state.fields.common.addOptionCost} onChange={(event) => this.handleChange(event,'addOptionCost','common')}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                            <Button value="Ок" onClick={() => this.saveRepairAppData()}/>
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