"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const testing_1 = require("rxjs/testing");
const test_simple_store_1 = require("./utils/test-simple-store");
describe('Select method', function () {
    let scheduler;
    let store;
    beforeEach(() => {
        store = new test_simple_store_1.TestSimpleStore();
        scheduler = new testing_1.TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });
    it('should emit last value on select', function () {
        scheduler.run((help) => {
            const $ = store['select'](s => s.x);
            help.expectObservable($).toBe('a', { a: 0 });
        });
    });
    it('should emit a value when selected property is changed using draft', function () {
        const $ = store['select'](s => s.x);
        scheduler.run((h) => {
            (0, rxjs_1.interval)(100).pipe((0, rxjs_1.take)(2), (0, rxjs_1.tap)(x => store['update'](draft => { draft.x = x + 10; }))).subscribe();
            h.expectObservable($).toBe("a 99ms b 99ms c", { a: 0, b: 10, c: 11 });
        });
    });
    it('should emit a value when selected property is changed using partial model', function () {
        const $ = store['select'](s => s.x);
        scheduler.run((h) => {
            (0, rxjs_1.interval)(100).pipe((0, rxjs_1.take)(2), (0, rxjs_1.tap)(x => store['update']({ x: x + 10 }))).subscribe();
            h.expectObservable($).toBe("a 99ms b 99ms c", { a: 0, b: 10, c: 11 });
        });
    });
    it('Should not emit values when other props change using draft', function () {
        const $ = store['select'](s => s.a);
        scheduler.run(h => {
            // emit changes on another prop
            (0, rxjs_1.interval)(100).pipe((0, rxjs_1.take)(5)).subscribe((v) => store['update'](draft => {
                draft.x = v;
            }));
            // expect selector to never emit other values than default
            h.expectObservable($).toBe("a", { a: { y: 0 } });
        });
    });
    it('Should not emit values when other props change using partial models', function () {
        const $ = store['select'](s => s.a);
        scheduler.run(h => {
            // emit changes on another prop
            (0, rxjs_1.interval)(100).pipe((0, rxjs_1.take)(5)).subscribe((v) => store['update']({ x: v }));
            // expect selector to never emit other values than default
            h.expectObservable($).toBe("a", { a: { y: 0 } });
        });
    });
    it('should emit value on selected object if inner prop is changed', function () {
        const $ = store['select'](s => s.a);
        scheduler.run(h => {
            (0, rxjs_1.interval)(100).pipe((0, rxjs_1.take)(1)).subscribe(v => store['update']({ a: { y: 999 } }));
            h.expectObservable($).toBe("a 99ms b", { a: { y: 0 }, b: { y: 999 } });
        });
    });
});
//# sourceMappingURL=store-select.spec.js.map