import { isObj } from "./is-obj"

export function deepFreeze<T>(obj:T): T {
    Object.keys(obj).forEach(key => {
        if (isObj(obj[key]))
            deepFreeze(obj[key]);
    });
    Object.freeze(obj);
    return obj;
}