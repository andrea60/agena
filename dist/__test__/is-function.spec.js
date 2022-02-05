"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_function_1 = require("../utils/is-function");
describe('IsFunction helper method', function () {
    it('should detect a real function', function () {
        const result = (0, is_function_1.isFunction)(function () { return true; });
        expect(result).toBeTrue();
    });
    it('should not detect objects as functions', function () {
        const result = (0, is_function_1.isFunction)({ a: 2 });
        expect(result).toBeFalse();
    });
    it('should not detect arrays as functions', function () {
        const result = (0, is_function_1.isFunction)(['a', 'b']);
        expect(result).toBeFalse();
    });
});
//# sourceMappingURL=is-function.spec.js.map