"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepFreeze = void 0;
const is_obj_1 = require("./is-obj");
function deepFreeze(obj) {
    Object.keys(obj).forEach(key => {
        if ((0, is_obj_1.isObj)(obj[key]))
            deepFreeze(obj[key]);
    });
    Object.freeze(obj);
    return obj;
}
exports.deepFreeze = deepFreeze;
//# sourceMappingURL=deep-freeze.js.map