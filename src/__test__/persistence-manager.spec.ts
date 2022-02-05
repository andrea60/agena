import { filter, map, switchMap, tap, timer } from "rxjs";
import { combineLatest, combineLatestInit } from "rxjs/internal/observable/combineLatest";
import { TestScheduler } from "rxjs/testing";
import { SimpleStore } from "..";
import { AgenaStore } from "../agena-store";
import { createPersistanceManager } from "./utils/test-persistence-manager";

interface State {
    num:number,
    name:string
}
@AgenaStore({
    persist: createPersistanceManager({ num: 20, name:'foo'})
})
class Store extends SimpleStore<State> {
    constructor(initialValue:State){
        super(initialValue);
    }
}


describe('PersistenceManager', function(){
    let scheduler:TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((a,b) => {
            expect(a).toEqual(b);
        })
    })
    it('Should stay loading until value is retrieved', function(){
        scheduler.run(test => {
            const store = new Store({num:0, name:'Aragorn'});

            const $ = store.loading$;
            test.expectObservable($).toBe("i 99ms a", { i: true, a:false });
        })
    })
    it('Should retrieve saved value', function(){
       scheduler.run(h => {
            const store = new Store({ num:0, name:'' });


            // wait 100ms and then selects the value
            const $ = timer(100).pipe(
                switchMap(() => store['select'](s => s))
            );

            // it should have a non-default value
            h.expectObservable($).toBe("100ms a", { a:{ num: 20, name:'foo' }})
        })
    })
    it('First emitted value after loading finishes should be the restored value', function(){
       scheduler.run(h => {
            const store = new Store({num:0, name:'Gandalf'});

            const $ = store.loading$.pipe(
                filter(loading => !loading),
                switchMap(() => store['select'](v => v))
            )

            h.expectObservable($).toBe("100ms a", { a: { name:'foo', num: 20 }});
        })

    })
})