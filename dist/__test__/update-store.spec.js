"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const testing_1 = require("rxjs/testing");
const test_simple_store_1 = require("./utils/test-simple-store");
describe('SimpleStore update method', function () {
    let store;
    let scheduler;
    beforeEach(() => {
        store = new test_simple_store_1.TestSimpleStore();
        scheduler = new testing_1.TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    it('should change store value', function () {
        store['update']({ x: 2 });
        expect(store['value'].x).toBe(2);
    });
    it('should emit last value on select', function () {
        scheduler.run((help) => {
            const $ = store['select'](s => s.x);
            help.expectObservable($).toBe('a', { a: 0 });
        });
    });
    it('should emit a value on selected property', function () {
        const $ = store['select'](s => s.x);
        scheduler.run((h) => {
            (0, rxjs_1.interval)(100).pipe((0, rxjs_1.take)(2), (0, rxjs_1.tap)(x => store['update']({ x: x + 10 }))).subscribe();
            h.expectObservable($).toBe("a 99ms b 99ms c", { a: 0, b: 10, c: 11 });
        });
    });
});
