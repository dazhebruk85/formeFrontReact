import axios from 'axios';

export const BigDecimalRegExp = RegExp(/^[0-9]*\.?[0-9]{0,2}$/i);
export const IntegerRegExp = RegExp(/^[0-9]*$/i);

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
export const EDIT_GRID_ENTITY = "editGridEntity";
export const DELETE_GRID_ENTITY = "deleteGridEntity";
export function commonChangeEntityInGrid(component,listName,entity,action) {
    if (!objectIsEmpty(entity)) {
        let list = component.state.fields[listName].list;
        if (action === EDIT_GRID_ENTITY) {
            let existIndex;
            for (let index in list) {
                if (list[index].id === entity.id) {
                    existIndex = index;
                    break;
                }
            }
            if (existIndex) {
                list[existIndex] = entity
            } else {
                list.push(entity);
            }
        } else if (action === DELETE_GRID_ENTITY) {
            for (let index in list) {
                if (list[index].id === entity.id) {
                    delete list[index];
                    break;
                }
            }
        }

        component.setState({
            fields:{
                ...component.state.fields,
                [listName]:{
                    ...component.state.fields[listName],
                    list:list
                }
            }
        });
    }
}

export function strToBigDecimal(value) {
    if (typeof value === 'number') {
        return value.toFixed(2);
    } else if (typeof value === 'string') {
        return parseFloat(value.replace(/[,]+/g, '.')).toFixed(2);
    }
}

export function strToInteger(value) {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string') {
        return parseFloat(value);
    }
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
        tem=ua.match(/\bOPR|Edge\/(\d+)/);
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
    }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
        name: M[0].toUpperCase(),
        version: M[1].toUpperCase()
    };
}

