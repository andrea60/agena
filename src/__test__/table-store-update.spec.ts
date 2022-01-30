import { first } from "rxjs";
import { generateEntity, TestTableStore } from "./utils/test-table-store"

describe('TableStore Update Methods', function(){
    let store:TestTableStore;
    let INIT_ENTITY_COUNT:number;

    beforeEach(() => {
        store = new TestTableStore();
        store.insertMany([
            generateEntity('_a', 'A', 10),
            generateEntity('_b', 'B', 25),
            generateEntity('_c', 'C', 17),
            generateEntity('_d', 'D', 48),
            generateEntity('_e', 'E', 38),
            generateEntity('_f', 'F', 15)
        ]);
        INIT_ENTITY_COUNT = store['value'].entities.length;
    })

    it('UpdateOne() should change one and only one entity', function(){
        store.updateOne('_c', { age: 99 });

        const a = store.getEntity('_a');
        const c = store.getEntity('_c');
        const f = store.getEntity('_f');

        expect(a.age).toEqual(10);
        expect(c.age).toEqual(99);
        expect(f.age).toEqual(15);
    })

    it('UpdateMany() should change only selected entities', function(){
        store.updateMany(['_c', '_e'], { age: 99 });

        const a = store.getEntity('_a');
        const c = store.getEntity('_c');
        const e = store.getEntity('_e');
        const f = store.getEntity('_f');

        expect(a.age).toEqual(10);
        expect(c.age).toEqual(99);
        expect(e.age).toEqual(99);
        expect(f.age).toEqual(15);
    })

    it('UpdateMany() should change only specified property', function(){
        store.updateMany(['_a','_b'], { address: {postalCode:'new'}});

        const a = store.getEntity('_a');
        const b = store.getEntity('_b');

        // check other prop did not change
        expect(a.name).toBe('A');
        expect(b.name).toBe('B');
        expect(a.address.city).toBe('Gondor');
        expect(b.address.city).toBe('Gondor');
        // check postalCode actually changed
        expect(a.address.postalCode).toBe('new');
        expect(b.address.postalCode).toBe('new');
    })


    it('UpdateAll() should change every entity', function(){
        store.updateAll({ age: 99 });

        const entities = store['value'].entities;
        entities.forEach(e => expect(e.age).toBe(99));
    })


    it('UpdateOne() should update entity change metadata', function(){
        const originalValue = store['getChange']('_a');

        // change entity
        store.updateOne('_a', { age: 1 });
        const newValue = store['getChange']('_a');
        expect(newValue).not.toBe(originalValue);

        // change again with overload
        store.updateOne('_a', e => { e.age++ });
        expect(store['getChange']('_a')).not.toBe(newValue);
    })

    it('UpdateMany() should update entity change metadata', function(){
        const ids = ['_a', '_d'];
        const source = ids.map(id => store['getChange'](id));

        // update entities
        store.updateMany(ids, { name:'changed'});
        const firstChange = ids.map(id => store['getChange'](id));
        expect(firstChange).not.toEqual(source);

        // update again, with overload
        store.updateMany(ids, e => { e.name = 'changed again'});
        const secondChange = ids.map(id => store['getChange'](id));
        expect(secondChange).not.toEqual(firstChange);
    })

    it('UpdateAll() should update every entity change metadata', function(){
        const source = store['value'].entities.map(e => store['getChange'](e.id));

        // perform update
        store.updateAll({ age: -1 });
        const firstChange = store['value'].entities.map(e => store['getChange'](e.id));
        expect(firstChange).not.toEqual(source);

        // perform update again, using overload
        store.updateAll(e => { e.name = 'Aragorn' });
        const secondChange = store['value'].entities.map(e => store['getChange'](e.id));
        expect(secondChange).not.toEqual(firstChange);

    })
})