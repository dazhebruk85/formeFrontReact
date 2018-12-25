import React, {Component} from "react";
import Modal from 'react-awesome-modal';
import Spinner from "../spinner/Spinner";
import * as Const from '../../Const';
import * as CommonUtils from "../../utils/CommonUtils";
import cookie from 'react-cookies';
import closePng from '../../media/data/close.png';
import { Tabs, Tab} from 'react-bootstrap';
import Button from './../field/Button'
import UniversalField from './../field/UniversalField'
import CollapsePanel from './../field/CollapsePanel'

class RepairAppEditForm extends Modal {

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible,
            errors: [],
            isLoading: false,
            closeAction:props.closeAction,
            successInfoMessages: [],
            restrictionsOpen:true,
            fields:{
                common : {
                    entityId: '',
                    appNum:'',
                    appDate:undefined
                },
                realEstate : {
                    address:'',
                    entranceNum:'',
                    floor:'',
                    trashCanExist:false
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getRepairAppData = this.getRepairAppData.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.entityId !== prevProps.entityId ) {
            this.setState({fields:{...this.state.fields, entityId:this.props.entityId}});
        }
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            setTimeout(() => this.getRepairAppData(), 0);
        }
    }

    async getRepairAppData() {
        if (this.state.fields.entityId) {
            this.setState({isLoading:true});
            let params = {entityId: this.state.fields.entityId};
            let responseData = await CommonUtils.makeAsyncPostEvent(Const.APP_URL,Const.REPAIR_APP_FORM_CONTEXT,Const.ENTITY_GET,params,cookie.load('sessionId'));
            this.setState({isLoading:false});
            if (responseData.errors.length > 0) {
                this.setState({errors: responseData.errors});
            } else {
                this.setRepairAppData({data: responseData.params});
            }
        }
    }

    setRepairApp(props) {
        let propsToChange = {}
        for (var key in props.data) {
            if (props.data.hasOwnProperty(key)) {
                if ("birthDate" === key) {
                    if (props.data[key]) {
                        propsToChange[key] = new Date(props.data[key]);
                    }
                } else {
                    propsToChange[key] = props.data[key] ? props.data[key] : '';
                }
            }
        }
        this.setState({fields: propsToChange});
    }

    closeModal() {
        this.setState({
            visible: false,
            errors: [],
            fields:{
                common : {
                    entityId: '',
                    appNum:'',
                    appDate:undefined
                },
                realEstate : {
                    address:'',
                    entranceNum:'',
                    floor:'',
                    trashCanExist:false
                }
            }
        });
        this.closeAction()
    }

    handleChange (value, fieldName, context) {
        if (value instanceof Date) {
            this.setState({
                fields: {
                    ...this.state.fields,
                    [context]: {
                        ...this.state.fields[context],
                        [fieldName]: value
                    }
                }
            });
        } else {
            this.setState({
                fields: {
                    ...this.state.fields,
                    [context]: {
                        ...this.state.fields[context],
                        [fieldName]: value
                    }
                }
            });
        }
    }

    render() {
        return(
            <Modal visible={this.state.visible} effect="fadeInDown">
                <div className="panel panel-default" style={{marginBottom:'0px'}}>
                    <Spinner isLoading={this.state.isLoading}/>
                    <div className="panel-heading" style={{height:'45px'}}>
                        <table style={{width:'100%'}}>
                            <tbody>
                            <tr>
                                <td style={{width:'90%'}}>
                                    <label style={{width:'100%',height:'24px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'2px'}} className="control-label col-sm-2" htmlFor="loginTextbox">Анкета</label>
                                </td>
                                <td style={{width:'10%',alignItems:'right'}}>
                                    <img alt='' onClick={() => this.closeModal()} align={'right'} src={closePng} style={{marginLeft:'27px',cursor:'pointer',height:"24px",width:"24px"}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="panel-body" style={{overflow:'auto',width:'800px',height:'600px'}}>
                        <form className="form-horizontal">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <UniversalField labelWidth='80px' fieldWidth='150px' label='Номер' type={Const.TEXTFIELD} value={this.state.fields.common.appNum} onChange={(event) => this.handleChange(event.target.value,'appNum','common')} maxLength={255}/>
                                    </td>
                                    <td>
                                        <UniversalField labelWidth='80px' fieldWidth='150px' label='Дата' type={Const.DATEPICKER} value={this.state.fields.common.appDate} onChange={(event) => this.handleChange(event,'appDate','common')}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" style={{height:'490px',marginRight:'20px'}}>
                                <Tab eventKey={1} title="Объект" style={{width:'100%'}}>
                                    <div style={{paddingTop:'10px'}}>
                                        <UniversalField style={{resize:'none',height:'50px'}} labelWidth='80px' label='Адрес' maxLength={255} type={Const.TEXTAREA} value={this.state.fields.realEstate.address} onChange={(event) => this.handleChange(event.target.value,'address','realEstate')}/>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <UniversalField labelWidth='80px' fieldWidth='150px' label='Подъезд' maxLength={10} type={Const.TEXTFIELD} value={this.state.fields.realEstate.entranceNum} onChange={(event) => this.handleChange(event.target.value,'entranceNum','realEstate')}/>
                                                </td>
                                                <td>
                                                    <UniversalField labelWidth='80px' fieldWidth='150px' label='Этаж' maxLength={10} type={Const.TEXTFIELD} value={this.state.fields.realEstate.floor} onChange={(event) => this.handleChange(event.target.value, 'floor','realEstate')}/>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <CollapsePanel title={'Ограничения'}>
                                            <UniversalField labelWidth='400px' label='Отсутствие контейнера для строительного мусора' type={Const.CHECKBOX} value={this.state.fields.realEstate.trashCanExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanExist','realEstate')}/>
                                            <UniversalField labelWidth='400px' label='Отсутствие пассажирского лифта' type={Const.CHECKBOX} value={this.state.fields.realEstate.passLiftExist} onChange={(event) => this.handleChange(event.target.checked,'passLiftExist','realEstate')}/>
                                            <UniversalField labelWidth='400px' label='Отсутствие грузового лифта' type={Const.CHECKBOX} value={this.state.fields.realEstate.serviceLiftExist} onChange={(event) => this.handleChange(event.target.checked,'serviceLiftExist','realEstate')}/>
                                            <UniversalField labelWidth='400px' label='Ограничения по высоте борта' type={Const.CHECKBOX} value={this.state.fields.realEstate.heightRestrictExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanExist','realEstate')}/>
                                            <UniversalField labelWidth='400px' label='Требуется пронос материала от паркинга до подъезда' type={Const.CHECKBOX} value={this.state.fields.realEstate.trashCanExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanExist','realEstate')}/>
                                            <UniversalField labelWidth='400px' label='Требуется пронос материала на этаж' type={Const.CHECKBOX} value={this.state.fields.realEstate.trashCanExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanExist','realEstate')}/>
                                            <UniversalField labelWidth='400px' label='Требуется разрешение УК на допуск рабочих' type={Const.CHECKBOX} value={this.state.fields.realEstate.trashCanExist} onChange={(event) => this.handleChange(event.target.checked,'trashCanExist','realEstate')}/>
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
                            <div className="btn-toolbar align-bottom" role="toolbar" style={{justifyContent:'center',display:'flex'}}>
                                <Button value="Ок" onClick={() => this.closeModal()}/>
                                <Button value="Отмена" onClick={() => this.closeModal()}/>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default RepairAppEditForm;