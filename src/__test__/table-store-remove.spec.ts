import { generateEntity, TestTableStore } from "./utils/test-table-store"

describe('TableStore Remove Method', function(){
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

    it('should remove existing entity', function(){
        store.removeOne('_a');

        const value = store['value'];
        expect(value.entities.length).toBe(INIT_ENTITY_COUNT-1);
        expect(Object.keys(value.metadata).length).toBe(INIT_ENTITY_COUNT-1);
    })

    it('should remove existing entities', function(){
        store.removeMany(['_a', '_b']);

        const value = store['value'];
        expect(value.entities.length).toBe(INIT_ENTITY_COUNT-2);
        expect(Object.keys(value.metadata).length).toBe(INIT_ENTITY_COUNT-2);
    })

    it('should remove entities matching a predicate function', function(){
        store.removeMany(e => e.age < 20);

        const value = store['value'];
        expect(value.entities.length).toBe(INIT_ENTITY_COUNT-3);
        expect(Object.keys(value.metadata).length).toBe(INIT_ENTITY_COUNT-3);
        expect(value.entities[0].name).toBe('B');
    })

    it('does not mess up indexes', function(){
        store.removeMany(['_d', '_a']);

        let c = store.getEntity('_c');
        let f = store.getEntity('_f');

        expect(store['value'].entities.length).toBe(INIT_ENTITY_COUNT-2);
        expect(c.name).toBe('C');
        expect(f.name).toBe('F');
    })
})