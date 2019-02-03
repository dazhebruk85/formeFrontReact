import React, {Component} from 'react';
import CommonModal from './../../baseComponent/modal/CommonModal'
import * as DateItils from '../../../utils/DateUtils';
import './../../../media/workCalendar/workCalendar.css';

class WorkCalendarModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors:[],
            successInfoMessages:[],
            isLoading:false,
            fields: {
                startDate:undefined,
                startDateForCalendar:undefined,
                endDate:undefined,
                endDateForCalendar:undefined,
                calendarCurrentMonth:undefined,
                weekArr:[]
            }
        };

        this.calcDatePeriodsForCalendar = this.calcDatePeriodsForCalendar.bind(this);
        this.fillDatesArrays = this.fillDatesArrays.bind(this);
        this.closeAction = props.closeAction
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && this.props.visible !== prevProps.visible ) {
            if (!this.state.fields.startDate) {
                let todayDate = new Date();
                let startDate = new Date(todayDate.getFullYear(), todayDate.getMonth(),1);
                this.calcDatePeriodsForCalendar(startDate)
            }
        }
    }

    calcDatePeriodsForCalendar(startDate) {
        let startDateForCalendar = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay() + 1);
        let endDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 0);
        let endDateForCalendar = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + (7 - endDate.getDay()));
        this.setState({
            fields: {
                ...this.state.fields,
                startDate:startDate,
                startDateForCalendar:startDateForCalendar,
                endDate:endDate,
                endDateForCalendar:endDateForCalendar,
                calendarCurrentMonth:startDate.getMonth()
            }
        })
        setTimeout(() => this.fillDatesArrays(), 0);
    }

    fillDatesArrays() {
        let startDateForArr = this.state.fields.startDateForCalendar;
        let endDateForArr = this.state.fields.endDateForCalendar;
        let weekArr = [];
        let daysArr = [];
        while (startDateForArr <= endDateForArr) {
            if (startDateForArr.getDay() === 1) {
                if (daysArr.length !== 0) {
                    weekArr.push(daysArr);
                }
                daysArr = [];
            }
            let day = {date:startDateForArr, dayOfMonth:startDateForArr.getDate(), dayMonth:startDateForArr.getMonth()};
            daysArr.push(day);
            startDateForArr = new Date(startDateForArr.getFullYear(),startDateForArr.getMonth(),startDateForArr.getDate()+1);
        }
        weekArr.push(daysArr);
        this.setState({
            fields: {
                ...this.state.fields,
                weekArr:weekArr
            }
        })
    }

    closeModal() {
        this.setState({
            errors:[],
            successInfoMessages:[],
            isLoading:false,
            fields: {
                ...this.state.fields,
                startDate:undefined,
                startDateForCalendar:undefined,
                endDate:undefined,
                endDateForCalendar:undefined,
                calendarCurrentMonth:undefined,
                weekArr:[]
            }
        });
        this.closeAction();
    }

    render() {
        let todayDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
        function getDayValueClassName(dayItem, fields) {
            if (dayItem.dayMonth !== fields.calendarCurrentMonth) {
                return 'divWeekDayDisabled';
            } else if (dayItem.date.getTime() === todayDate.getTime()) {
                return 'divWeekDayToday';
            } else {
                return 'divWeekDay';
            }

        }

        return(
            <CommonModal loading={this.state.isLoading} title={'Рабочий календарь'} visible={this.props.visible} closeAction={() => this.closeModal()}>
                <div>
                    <table>
                        <thead>
                            <tr>
                                {DateItils.weekDays.map((item, index) => (
                                    <td className={'tdWeekDay'} key={'weekHeaderTd'+index}>
                                        <div className={'divWeekHeaderDay'}>{item.rusShortName}</div>
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.fields.weekArr.map((weekItem, weekIndex) => (
                                <tr key={'weekValueTr'+weekIndex}>
                                    {weekItem.map((dayItem, dayIndex) => (
                                        <td className={'tdWeekDay'} key={'weekValueTd'+weekIndex+dayIndex}>
                                            <div className={getDayValueClassName(dayItem, this.state.fields)}>{dayItem.dayOfMonth}</div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CommonModal>
        )
    }

}

export default WorkCalendarModal;