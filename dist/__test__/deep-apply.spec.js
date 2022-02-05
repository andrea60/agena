"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deep_apply_1 = require("../utils/deep-apply");
const is_obj_1 = require("../utils/is-obj");
describe('deep-apply', function () {
    let objA;
    beforeEach(() => {
        objA = {
            a: 1,
            b: 1,
            x: {
                a: '1',
                y: {
                    b: '1'
                }
            }
        };
    });
    it('Should change values specified on the recipe', function () {
        const modified = (0, deep_apply_1.deepApply)(objA, { b: -1, x: { a: '-1' } });
        expect(modified.b).toBe(-1);
        expect(modified.x.a).toBe('-1');
    });
    it('Should not change values not directly modified', function () {
        const modified = (0, deep_apply_1.deepApply)(objA, { b: -1, x: { a: '-1' } });
        expect(modified.a).toBe(objA.a);
        expect(modified.x.y).toBe(objA.x.y);
        expect(modified.x.y.b).toBe(objA.x.y.b);
    });
    it('Should change object when inner properties are changed', function () {
        const modified = (0, deep_apply_1.deepApply)(objA, { x: { a: 'CHANGED' } });
        expect(modified.x).not.toBe(objA.x);
    });
    it('does not change recipe parameter', function () {
        const newObj = (0, deep_apply_1.deepApply)({ __foreignProp: true }, objA);
        // @ts-ignore
        expect(objA.__foreignProp).not.toBeDefined();
    });
    it('Should not add other fields not present in the recipe', function () {
        const newObj = (0, deep_apply_1.deepApply)({}, objA);
        function getKeys(obj, prefix = '') {
            let keys = [];
            for (const k in obj) {
                keys.push(prefix + k);
                if ((0, is_obj_1.isObj)(obj[k]))
                    keys = keys.concat(getKeys(obj[k], prefix + k + "."));
            }
            return keys;
        }
        const newObjKeys = getKeys(newObj);
        const keys = getKeys(objA);
        expect(newObjKeys).toEqual(keys);
    });
});
//# sourceMappingURL=deep-apply.spec.js.map