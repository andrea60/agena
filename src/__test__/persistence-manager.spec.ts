import { switchMap, timer } from "rxjs";
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

}


describe('PersistenceManager', function(){
    let scheduler:TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((a,b) => {
            expect(a).toEqual(b);
        })
    })

    it('Should retrieve saved value', function(){
        const store = new Store({ num:0, name:'' });

        scheduler.run(h => {
            // wait 100ms and then selects the value
            const $ = timer(100).pipe(
                switchMap(() => store['select'](s => s))
            );

            // it should have a non-default value
            h.expectObservable($).toBe("100ms a", { a:{ num: 20, name:'foo' }})
        })
    })
})