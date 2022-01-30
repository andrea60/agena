import { deepApply } from "../utils/deep-apply";


type TestObject = {
    a:number,
    b:number,
    x: {
        a:string;
        y:{
            b:string;
        }
    }
}

describe('deep-apply', function(){
    let objA:TestObject;

    beforeEach(() => {
        objA = {
            a: 1,
            b: 1,
            x: {
                a: '1',
                y: {
                    b:'1'
                }
            }
        }
    })
    it('Should change values specified on the recipe', function(){
        const modified = deepApply(objA, { b: -1, x: { a: '-1' }});

        expect(modified.b).toBe(-1);
        expect(modified.x.a).toBe('-1');
    })

    it('Should not change values not directly modified', function(){
        const modified = deepApply(objA, { b: -1, x: { a: '-1' }});
        
        expect(modified.a).toBe(objA.a);
        expect(modified.x.y).toBe(objA.x.y);
        expect(modified.x.y.b).toBe(objA.x.y.b);
    })

    it('Should change object when inner properties are changed', function(){
        const modified = deepApply(objA, { x: { a:'CHANGED' }});

        expect(modified.x).not.toBe(objA.x);
    })

    it('does not change recipe parameter', function(){
        const newObj = deepApply<any>({ __foreignProp:true }, objA);

        // @ts-ignore
        expect(objA.__foreignProp).not.toBeDefined();
    })

})