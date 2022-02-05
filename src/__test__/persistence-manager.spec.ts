import { switchMap, tap, timer } from "rxjs";
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
    constructor(initialValue:State, a:string,b:string){
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
    // it('Should stay loading until value is retrieved', function(){
    //     scheduler.run(test => {
    //         const store = new Store({num:0, name:'Aragorn'});

    //         const $ = store.loading$.pipe(tap(l => console.log('Loading state: ',l)));
    //         test.expectObservable($).toBe("i a", { i: true, a:false });
    //     })
    // })
    it('Should retrieve saved value', function(){
       scheduler.run(h => {
            const store = new Store({ num:0, name:'' },'hello','world');


            // wait 100ms and then selects the value
            const $ = timer(100).pipe(
                tap(() => console.log('store value: ', store['value'])),
                switchMap(() => store['select'](s => s))
            );

            // it should have a non-default value
            h.expectObservable($).toBe("100ms a", { a:{ num: 20, name:'foo' }})
        })
    })
})