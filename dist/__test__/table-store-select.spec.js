"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const testing_1 = require("rxjs/testing");
const test_table_store_1 = require("./utils/test-table-store");
describe('TableStore Selection Methods', function () {
    let store;
    let scheduler;
    beforeEach(() => {
        store = new test_table_store_1.TestTableStore();
        store.insertMany([
            (0, test_table_store_1.generateEntity)('_a', 'A', 10),
            (0, test_table_store_1.generateEntity)('_b', 'B', 25),
            (0, test_table_store_1.generateEntity)('_c', 'C', 17),
            (0, test_table_store_1.generateEntity)('_d', 'D', 48),
            (0, test_table_store_1.generateEntity)('_e', 'E', 38),
            (0, test_table_store_1.generateEntity)('_f', 'F', 15)
        ]);
        scheduler = new testing_1.TestScheduler((actual, expected) => {
            if (Array.isArray(expected))
                expect(actual.sort()).toEqual(expected.sort());
            else
                expect(actual).toEqual(expected);
        });
    });
    it('SelectAll() reacts to any change in the collection', function () {
        const $ = store.selectAll().pipe((0, rxjs_1.map)(col => col.length));
        scheduler.run(h => {
            (0, rxjs_1.timer)(100).subscribe(() => store.removeOne('_a'));
            (0, rxjs_1.timer)(200).subscribe(() => store.insertOne((0, test_table_store_1.generateEntity)('new')));
            (0, rxjs_1.timer)(300).subscribe(() => store.updateOne('_d', { age: 49 }));
            (0, rxjs_1.timer)(400).subscribe(() => store.removeAll());
            h.expectObservable($).toBe("i 99ms a 99ms b 99ms c 99ms d", { i: 6, a: 5, b: 6, c: 6, d: 0 });
        });
    });
    it('SelectMany(ids) reacts to change in selected entities', function () {
        const $ = store.selectMany(['_c', '_e']).pipe((0, rxjs_1.map)(entities => entities.map(e => e.name)));
        scheduler.run(h => {
            (0, rxjs_1.timer)(100).subscribe(() => store.updateOne('_c', e => { e.name = 'X'; })); // update subset of selected
            (0, rxjs_1.timer)(200).subscribe(() => store.updateMany(['_c', '_e', '_b'], { age: 99 })); // update many (superset of selected)
            (0, rxjs_1.timer)(300).subscribe(() => store.removeMany(['_e'])); // remove entity from selected set
            h.expectObservable($).toBe("i 99ms a 99ms b 99ms c", { i: ['C', 'E'], a: ['X', 'E'], b: ['X', 'E'], c: ['X'] });
        });
    });
    it('SelectMany(ids) does not react to change in other entities', function () {
        const $ = store.selectMany(['_c', '_e']).pipe((0, rxjs_1.map)(entities => entities.map(e => e.name)));
        scheduler.run(h => {
            (0, rxjs_1.timer)(100).subscribe(() => store.updateOne('_a', e => { e.name = 'X'; })); // update subset of selected
            (0, rxjs_1.timer)(200).subscribe(() => store.updateMany(['_a', '_f', '_d'], { age: 99 })); // update many (superset of selected)
            (0, rxjs_1.timer)(300).subscribe(() => store.removeMany(['_b'])); // remove entity from selected set
            h.expectObservable($).toBe("i", { i: ['C', 'E'] });
        });
    });
    it('SelectMany(filter-function) reacts to change in selected entities', function () {
        const $ = store.selectMany(e => e.age < 25).pipe((0, rxjs_1.map)(entities => entities.map(e => e.name)));
        scheduler.run(h => {
            (0, rxjs_1.timer)(100).subscribe(() => store.updateOne('_c', e => { e.age = 35; })); // update subset of selected, pushing it out of filtered set
            (0, rxjs_1.timer)(200).subscribe(() => store.updateMany(['_c', '_e', '_a'], { age: 99 })); // update many, reducing filtered set
            (0, rxjs_1.timer)(300).subscribe(() => store.removeMany(['_f'])); // remove entity from selected set
            h.expectObservable($).toBe("i 99ms a 99ms b 99ms c", { i: ['A', 'C', 'F'], a: ['A', 'F'], b: ['F'], c: [] });
        });
    });
});
