"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const testing_1 = require("rxjs/testing");
const test_simple_store_1 = require("./utils/test-simple-store");
describe('StoreChanged$ observable', function () {
    let store;
    let scheduler;
    beforeEach(() => {
        store = new test_simple_store_1.TestSimpleStore();
        scheduler = new testing_1.TestScheduler((actual, expected) => {
            if (Array.isArray(expected))
                expect(actual.sort()).toEqual(expected.sort());
            else
                expect(actual).toEqual(expected);
        });
    });
    it('emits when update() is called', function () {
        const $ = store['storeChanged$']().pipe((0, rxjs_1.map)(e => e.current));
        scheduler.run(h => {
            (0, rxjs_1.timer)(100).subscribe(() => store['update']({ x: 2 }));
            (0, rxjs_1.timer)(200).subscribe(() => store['update'](state => { state.a.y = 100; }));
            (0, rxjs_1.timer)(300).subscribe(() => store['reset']());
            h.expectObservable($).toBe("100ms a 99ms b 99ms c", {
                a: { x: 2, a: { y: 0 } },
                b: { x: 2, a: { y: 100 } },
                c: { x: 0, a: { y: 0 } }
            });
        });
    });
});
