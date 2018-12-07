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
    return propArr;
}

export async function makeAsyncPostEvent(url, context, action, params) {
    try {
        const asyncPostEvent = await axios.post(url, {
            context: context,
            action: action,
            params: params
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

