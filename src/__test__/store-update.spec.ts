import { delay, from, interval, shareReplay, take, tap, timer } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { SimpleState, TestSimpleStore } from "./utils/test-simple-store"

describe('SimpleStore update method', function(){
    let store:TestSimpleStore;
    let scheduler:TestScheduler;

    beforeEach(() => { 
        store = new TestSimpleStore();
        scheduler = new TestScheduler((actual,expected) => {
            expect(actual).toEqual(expected);
        })
    })

    it('should change store value', function(){
        store['update']({x:2})
        expect(store['value'].x).toBe(2);
    })
    it('should emit last value on select', function(){
        scheduler.run((help) => {
            const $ = store['select'](s => s.x);

            help.expectObservable($).toBe('a', { a: 0});
        })
    })
    it('should emit a value on selected property', function(){
        
        const $ = store['select'](s => s.x);
        scheduler.run((h) => {
            interval(100).pipe(
                take(2),
                tap(x => store['update']({x: x+10}))
            ).subscribe();

            h.expectObservable($).toBe("a 99ms b 99ms c", { a: 0, b: 10, c:11 });
        });
    })

    
})