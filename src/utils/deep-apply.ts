import { Subset } from "../subset.type";
import { isObj } from "./is-obj";
const cloneDeep = require('clone-deep');

export function deepApply<T extends object>(source:T, recipe:Subset<T>): T {
    return _deepApply(source, recipe, true);
}


function _deepApply<T extends object>(source:T, recipe:Subset<T>, root:boolean): T {
    const result:Subset<T> = root ? cloneDeep(recipe) : recipe;
    const keys = Object.keys(source);
    for(let key of keys){
        const value = source[key];

        if (result[key] === undefined) 
            result[key] = value;
        else if (isObj(value) && isObj(result[key]))
            _deepApply(value, result[key], false);
    }
    return result as T;
}