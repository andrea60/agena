import { isObj } from "../utils/is-obj";

describe('isObj', function(){

    it('Should return false on null', function(){
        const res = isObj(null);
        expect(res).toBe(false);
    });
    it('Should return false on undefined', function(){
        const res = isObj(undefined);
        expect(res).toBe(false);
    })
    it('Should return false on string', function(){
        const res = isObj("str");
        expect(res).toBe(false);
    })
    it('Should return false on number', function(){
        const res = isObj(2);
        expect(res).toBe(false);
    })
    it('Should return false on array', function(){
        const res = isObj([2,4]);
        expect(res).toBe(false);
    })
    it('Should return true on object', function(){
        const res = isObj({});
        expect(res).toBe(true);
    })
})