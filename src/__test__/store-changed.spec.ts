import { map, timer } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { TestSimpleStore } from "./utils/test-simple-store"

describe('StoreChanged$ observable', function(){
    let store:TestSimpleStore;
    let scheduler:TestScheduler;

    beforeEach(() => {
        store = new TestSimpleStore();
        scheduler = new TestScheduler((actual,expected) => {
            if (Array.isArray(expected))
                expect(actual.sort()).toEqual(expected.sort());
            else 
                expect(actual).toEqual(expected);
        });
    })

    it('emits when update() is called', function(){
        const $ = store['storeChanged$']().pipe(map(e => e.current));
        scheduler.run(h => {
            timer(100).subscribe(() => store['update']({ x:2 }));
            timer(200).subscribe(() => store['update'](state => { state.a.y = 100 }));
            timer(300).subscribe(() => store['reset']());
            
            h.expectObservable($).toBe("100ms a 99ms b 99ms c", { 
                a: { x: 2, a: { y: 0 }},
                b: { x: 2, a: { y: 100 }},
                c: { x: 0, a: { y: 0 }}
            });
        });
    })
})