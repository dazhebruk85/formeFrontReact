import axios from 'axios';

export function genGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function objectToPropArr(object) {
    let propArr = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            propArr.push({key:key, value:object[key]});
        }
    };
    propArr = propArr.sort(function(a, b) {
        return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });
    return propArr;
}

export function objectIsEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function commonHandleChange(component,context,fieldName,value) {
    component.setState({
        fields: {
            ...component.state.fields,
            [context]: {
                ...component.state.fields[context],
                [fieldName]: value
            }
        }
    });
}

export function strToBigDecimal(value) {
    return parseFloat(value.replace(/[,]+/g, '.')).toFixed(2);
}

export async function makeAsyncPostEvent(url, context, action, params, sessionId) {
    try {
        const asyncPostEvent = await axios.post(url, {
            context: context,
            action: action,
            params: params,
            sessionId: sessionId
        });
        return asyncPostEvent.data
    } catch (e) {
        const error = await e;
        if (!error.status) {
            return {errors:[{code:'SYS',message:'APP сервер недоступен'}]};
        } else {
            return {errors:[{code:'SYS',message:'Непредвиденная ошибка на сервере'}]};
        }
    }
}

