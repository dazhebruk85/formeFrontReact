import moment from "moment";

export function dateToStringWithTimeSec(date) {
    if (date) {
        let formattedDate = moment(date).format('DD.MM.YYYY HH:mm:ss');
        return formattedDate
    } else {
        return '';
    }
}

export function dateToStringWithTime(date) {
    if (date) {
        let formattedDate = moment(date).format('DD.MM.YYYY HH:mm');
        return formattedDate
    } else {
        return '';
    }
}

export function dateToString(date) {
    if (date) {
        let formattedDate = moment(date).format('DD.MM.YYYY');
        return formattedDate
    } else {
        return '';
    }
}

export const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export const weekDays = [
    {systemName:'monday',engShortName:'Mo',engName:'Monday',rusShortName:'Пн',rusName:'Понедельник'},
    {systemName:'tuesday',engShortName:'Tu',engName:'Tuesday',rusShortName:'Вт',rusName:'Вторник'},
    {systemName:'wednesday',engShortName:'We',engName:'Wednesday',rusShortName:'Ср',rusName:'Среда'},
    {systemName:'thursday',engShortName:'Th',engName:'Thursday',rusShortName:'Чт',rusName:'Четверг'},
    {systemName:'friday',engShortName:'Fr',engName:'Friday',rusShortName:'Пт',rusName:'Пятница'},
    {systemName:'saturday',engShortName:'Sa',engName:'Saturday',rusShortName:'Сб',rusName:'Суббота'},
    {systemName:'sunday',engShortName:'Su',engName:'Sunday',rusShortName:'Вс',rusName:'Восресенье'},
];