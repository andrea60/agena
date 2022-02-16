"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = void 0;
function isObj(param) {
    return !!param &&
        !Array.isArray(param) &&
        typeof param === 'object';
}
exports.isObj = isObj;
//# sourceMappingURL=is-obj.js.map