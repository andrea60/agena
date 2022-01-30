"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayEquals = void 0;
function arrayEquals(first, second) {
    for (let i = 0; i < first.length; i++)
        if (first[i] !== second[i])
            return false;
    return first.length == second.length;
}
exports.arrayEquals = arrayEquals;
