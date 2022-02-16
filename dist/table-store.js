"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableStore = void 0;
const immer_1 = require("immer");
const rxjs_1 = require("rxjs");
const store_1 = require("./store");
const arr_equals_1 = require("./utils/arr-equals");
const deep_apply_1 = require("./utils/deep-apply");
const deep_freeze_1 = require("./utils/deep-freeze");
const is_function_1 = require("./utils/is-function");
class TableStore extends store_1.SimpleStore {
    constructor(initialState, scope = 'global') {
        super(Object.assign({ entities: [], metadata: {} }, initialState), scope);
        this._changeUID = 0;
    }
    getEntity(id) {
        return this.getEntityFromState(id, this.value);
    }
    getEntityFromState(id, state) {
        const meta = state.metadata[id];
        if (meta != undefined)
            return state.entities[meta.index];
        return null;
    }
    getIndex(id, state) {
        var _a;
        const target = state ? state : this.value;
        return (_a = target.metadata[id]) === null || _a === void 0 ? void 0 : _a.index;
    }
    getChange(id, state) {
        var _a;
        const target = state ? state : this.value;
        return (_a = target.metadata[id]) === null || _a === void 0 ? void 0 : _a.change;
    }
    selectAll() {
        return this.select(e => e.entities);
    }
    selectOne(key) {
        return this.select(s => this.getEntityFromState(key, s));
    }
    selectMany(filter) {
        let selector$;
        if ((0, is_function_1.isFunction)(filter)) {
            // lambda expression
            selector$ = this.select(s => s.entities).pipe((0, rxjs_1.map)(e => e.filter(filter)));
        }
        else {
            // direct keys
            selector$ = this.select(s => s.entities).pipe((0, rxjs_1.map)(entities => {
                // find only valid indeces
                const indexes = filter.map(id => this.getIndex(id)).filter(idx => idx != undefined);
                // find entities by those indeces
                return indexes.map(idx => entities[idx]);
            }));
        }
        // optimize: suppress emission if entities did not actually change.
        // without this code, it would emit even if other entities (not selected by the parameter) changed in the collection
        // the only workaround is to compare the versioning of each selected entity and avoid emission until any entity changed version
        selector$ = selector$.pipe(
        // it must insert the change array into the stream, so it get cached and can be used to compare later with previous value
        (0, rxjs_1.map)(entities => ({
            entities,
            changes: entities.map(e => this.getChange(this.getId(e)))
        })), (0, rxjs_1.distinctUntilChanged)((prev, cur) => {
            // compare change arrays
            return (0, arr_equals_1.arrayEquals)(prev.changes, cur.changes);
        }), (0, rxjs_1.map)(d => d.entities));
        return selector$;
    }
    removeAll() {
        let removed = [];
        this.update(draft => {
            removed = draft.entities;
            // clear the storage
            draft.entities = [];
            draft.metadata = {};
        });
        this.entitiesRemoved(removed);
    }
    removeOne(key) {
        return this.removeMany([key]);
    }
    removeMany(filter) {
        // ⚠️ This method may be inefficient since it has to re-index the collection when you remove an item.
        let ids = [];
        if ((0, is_function_1.isFunction)(filter)) {
            // predicate param - find the actual indexes
            ids = this.value.entities.filter(filter).map(e => this.getId(e));
        }
        else
            ids = filter;
        // actual remove
        if (ids.length > 0) {
            const removed = [];
            this.update(draft => {
                let indeces = [];
                ids.forEach(id => {
                    const { index } = draft.metadata[id];
                    if (index == undefined) {
                        return;
                    }
                    // remove from index map
                    delete draft.metadata[id];
                    // saves the index for later use
                    indeces.push(index);
                });
                // sort to make shifting possibile
                indeces = indeces.sort();
                // everytime I remove an item from the array I add a negative index to account for array element shifting
                let shift = 0;
                for (let idx of indeces) {
                    removed.push(draft.entities.splice(idx + shift, 1)[0]); // safe since it always removes one entity at a time
                    shift--;
                }
                // re-index the whole db from the first altered index
                for (let i = indeces[0]; i < draft.entities.length; i++) {
                    const id = this.getId(draft.entities[i]);
                    draft.metadata[id].index = i;
                }
            });
            // event
            this.entitiesRemoved(removed);
        }
    }
    updateOne(id, entity) {
        // check id exists
        const idx = this.getIndex(id);
        if (idx === undefined)
            return;
        const current = this.value.entities[idx];
        let newEntity;
        // apply transformation
        if ((0, is_function_1.isFunction)(entity))
            newEntity = (0, immer_1.produce)(current, entity);
        else
            newEntity = (0, deep_apply_1.deepApply)(current, entity);
        // update the store
        this.update(draft => {
            draft.entities[idx] = newEntity;
            draft.metadata[id].change = this.getChangeUID();
        });
        // event
        this.entitiesUpdated([{ old: current, new: newEntity }]);
    }
    updateMany(ids, updater) {
        const metadata = ids.map(id => ({ id, idx: this.getIndex(id) })).filter(idx => idx.idx != undefined);
        if (metadata.length == 0)
            return;
        let updateList = [];
        this.update(draft => {
            updateList = metadata.map(meta => {
                let newEntity;
                let current = draft.entities[meta.idx];
                if ((0, is_function_1.isFunction)(updater))
                    newEntity = (0, immer_1.produce)(current, updater);
                else
                    newEntity = (0, deep_apply_1.deepApply)(current, updater);
                draft.entities[meta.idx] = newEntity;
                draft.metadata[meta.id].change = this.getChangeUID();
                return ({ new: newEntity, old: current });
            });
        });
        // event
        this.entitiesUpdated(updateList);
    }
    updateAll(updater) {
        const changeList = [];
        this.update(draft => {
            let newEntities = [];
            // iterate just one time, uglier but better than multiple map()
            for (let old of draft.entities) {
                let newEntity = (0, is_function_1.isFunction)(updater) ? (0, immer_1.produce)(old, updater) : (0, deep_apply_1.deepApply)(old, updater);
                newEntities.push(newEntity);
                changeList.push({ old, new: newEntity });
            }
            // replace the whole collection with modified version
            draft.entities = newEntities;
            // update all the change uids
            const change = this.getChangeUID();
            for (let id in draft.metadata)
                draft.metadata[id].change = change;
        });
        // signal event
        this.entitiesUpdated(changeList);
    }
    insertOne(entity) {
        this.insert([entity], false);
    }
    insertMany(entities) {
        this.insert(entities, false);
    }
    upsertOne(entity) {
        this.insert([entity], true);
    }
    upsertMany(entities) {
        this.insert(entities, true);
    }
    insert(entities, overwrite) {
        const updateList = [];
        const createList = [];
        this.update(draft => {
            const createMap = {};
            const updateMap = {};
            entities.forEach(e => {
                const id = this.getId(e);
                // check if it exists and if it can update
                if (draft.metadata[id] != undefined) {
                    if (overwrite)
                        updateMap[id] = e;
                }
                // if it doesn't, create it
                else
                    createMap[id] = e;
            });
            // -- UPDATE
            for (let id in updateMap) {
                const newEntity = (0, deep_freeze_1.deepFreeze)(updateMap[id]);
                draft.entities[this.getIndex(id, draft)] = newEntity;
                // register for event dispatching
                updateList.push({ old: updateMap[id], new: newEntity });
            }
            // ---- CREATE 
            for (let id in createMap) {
                // generate a new IDx
                const idx = draft.entities.length;
                // use it to push data in both array and index map
                const entity = (0, deep_freeze_1.deepFreeze)(createMap[id]);
                draft.entities[idx] = entity;
                draft.metadata[id] = {
                    index: idx,
                    change: this.getChangeUID()
                };
                // register for event dispatching
                createList.push(entity);
            }
        });
        this.entitiesAdded(createList);
        this.entitiesUpdated(updateList);
    }
    getChangeUID() {
        return ++this._changeUID;
    }
    getId(entity) {
        return entity[this.config.idKey];
    }
    entitiesUpdated(versions) {
    }
    entitiesRemoved(entities) {
    }
    entitiesAdded(entities) {
    }
}
exports.TableStore = TableStore;
const table = new TableStore({
    filter: ''
});
//# sourceMappingURL=table-store.js.map