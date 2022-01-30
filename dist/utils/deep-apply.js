"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepApply = void 0;
const is_obj_1 = require("./is-obj");
const cloneDeep = require('clone-deep');
function deepApply(source, recipe) {
    return _deepApply(source, recipe, true);
}
exports.deepApply = deepApply;
function _deepApply(source, recipe, root) {
    const result = root ? cloneDeep(recipe) : recipe;
    const keys = Object.keys(source);
    for (let key of keys) {
        const value = source[key];
        if (result[key] === undefined)
            result[key] = value;
        else if ((0, is_obj_1.isObj)(value) && (0, is_obj_1.isObj)(result[key]))
            _deepApply(value, result[key], false);
    }
    return result;
}
