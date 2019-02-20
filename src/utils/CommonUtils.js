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
    for (let key in object) {
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
    if (context) {
        component.setState({
            fields: {
                ...component.state.fields,
                [context]: {
                    ...component.state.fields[context],
                    [fieldName]: value
                }
            }
        });
    } else {
        component.setState({
            fields: {
                ...component.state.fields,
                [fieldName]: value
            }
        })
    }
}

export function strToBigDecimal(value) {
    return parseFloat(value.replace(/[,]+/g, '.')).toFixed(2);
}

export async function makeAsyncPostEvent(url, context, action, params, entity) {
    try {
        const asyncPostEvent = await axios.post(url, {
            context: context,
            action: action,
            params: params,
            sessionId: getFormLocalStorage("sessionId"),
            entity: entity ? entity : ''
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

export function getFormLocalStorage(key) {
    return window.localStorage.getItem(key)
}

export function putToLocalStorage(key, value) {
    return window.localStorage.setItem(key,value)
}

export function getBrowserInfo() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
    }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
    }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
        name: M[0].toUpperCase(),
        version: M[1].toUpperCase()
    };
}

