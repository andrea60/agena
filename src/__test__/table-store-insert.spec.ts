import { generateEntity, TestTableStore } from "./utils/test-table-store"

describe('TableStore Insert Method', function(){
    let store:TestTableStore;

    beforeEach(() => {
        store = new TestTableStore();
        store.insertOne(generateEntity('_default'));
    })

    it('should insert new many entities', function(){
        store.insertMany([
            generateEntity('A'),
            generateEntity('B')
        ]);

        const value = store['value'];
        expect(value.entities.length).toBe(3);
        expect(Object.keys(value.metadata)).toContain('A');
        expect(Object.keys(value.metadata)).toContain('B');
    })
    
    it('should insert a new entity', function(){
        store.insertOne(generateEntity('A'));

        const value = store['value'];
        expect(value.entities.length).toBe(2);
        expect(Object.keys(value.metadata)).toContain('A');
    })

    it('should not replace an existing entity', function(){
        store.insertOne(generateEntity('_default', 'changed!'));

        const entity = store.getEntity('_default');
        const value = store['value'];
        expect(value.entities.length).toBe(1);
        expect(entity.name).not.toBe("changed!");
    })
})