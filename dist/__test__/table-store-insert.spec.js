"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_table_store_1 = require("./utils/test-table-store");
describe('TableStore Insert Method', function () {
    let store;
    beforeEach(() => {
        store = new test_table_store_1.TestTableStore();
        store.insertOne((0, test_table_store_1.generateEntity)('_default'));
    });
    it('should insert new many entities', function () {
        store.insertMany([
            (0, test_table_store_1.generateEntity)('A'),
            (0, test_table_store_1.generateEntity)('B')
        ]);
        const value = store['value'];
        expect(value.entities.length).toBe(3);
        expect(Object.keys(value.metadata)).toContain('A');
        expect(Object.keys(value.metadata)).toContain('B');
    });
    it('should insert a new entity', function () {
        store.insertOne((0, test_table_store_1.generateEntity)('A'));
        const value = store['value'];
        expect(value.entities.length).toBe(2);
        expect(Object.keys(value.metadata)).toContain('A');
    });
    it('should not replace an existing entity', function () {
        store.insertOne((0, test_table_store_1.generateEntity)('_default', 'changed!'));
        const entity = store.getEntity('_default');
        const value = store['value'];
        expect(value.entities.length).toBe(1);
        expect(entity.name).not.toBe("changed!");
    });
});
//# sourceMappingURL=table-store-insert.spec.js.map