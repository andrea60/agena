import { isFunction } from "../utils/is-function"

describe('IsFunction helper method', function(){
    it('should detect a real function', function(){
        const result = isFunction(function() { return true });
        expect(result).toBeTrue();
    })

    it('should not detect objects as functions', function(){
        const result = isFunction({ a: 2});

        expect(result).toBeFalse();
    })
    it('should not detect arrays as functions', function(){
        const result = isFunction(['a','b']);

        expect(result).toBeFalse();
    })
})