import * as deepmerge from "deepmerge";
import { produce } from "immer";
import { combineLatest, distinctUntilChanged, map, Observable, pluck, tap } from "rxjs";
import { SimpleStore } from "./store";
import { Subset } from "./subset.type";
import { Key, TableState } from "./table-state";
import { TableStoreConfig } from "./table-store-config";
import { arrayEquals } from "./utils/arr-equals";
import { deepApply } from "./utils/deep-apply";
import { deepFreeze } from "./utils/deep-freeze";
import { isFunction } from "./utils/is-function";


type Selector<E> = Key[] | ((entity:E) => boolean);

export class TableStore<E extends {}, S> extends SimpleStore<TableState<E, S>> {
    private config:TableStoreConfig = { idKey:'id'};
    private _changeUID:number = 0;
    constructor(initialState:S, config?:TableStoreConfig){
        super({
            entities:[],
            metadata:{},
            custom: initialState
        });
        
        if (config)
            this.config = config;
    }

    getEntity(id:Key){
        return this.getEntityFromState(id, this.value);
    }
    private getEntityFromState(id:Key, state:TableState<E, S>){
        const meta = state.metadata[id];
        if (meta != undefined)
            return state.entities[meta.index];
        return null;
    }
    private getIndex(id:Key, state?:TableState<E,S>){
        const target = state ? state : this.value;
        return target.metadata[id]?.index;
    }
    private getChange(id:Key, state?:TableState<E,S>){
        const target = state ? state : this.value;
        return target.metadata[id]?.change;
    }

    selectAll(){
        return this.select(e => e.entities);
    }
    selectOne(key:Key){      
        return this.select(s => this.getEntityFromState(key, s));  
    }
    selectMany(filter:Selector<E>) {
        let selector$:Observable<E[]>;
        if (isFunction(filter)){
            // lambda expression
            selector$ = this.select(s => s.entities).pipe(map(e => e.filter(filter)));

        } else {
            // direct keys
            selector$ = this.select(s => s.entities).pipe(
                map(entities => {
                    // find only valid indeces
                    const indexes = filter.map(id => this.getIndex(id)).filter(idx => idx != undefined);
                    // find entities by those indeces
                    return indexes.map(idx => entities[idx]);
                })
            )
        }   
        // optimize: suppress emission if entities did not actually change.
        // without this code, it would emit even if other entities (not selected by the parameter) changed in the collection
        // the only workaround is to compare the versioning of each selected entity and avoid emission until any entity changed version
        selector$ = selector$.pipe(
            // it must insert the change array into the stream, so it get cached and can be used to compare later with previous value
            map(entities => ({
                entities,
                changes: entities.map(e => this.getChange(this.getId(e)))
            })),
            distinctUntilChanged((prev,cur) => {
                // compare change arrays
                return arrayEquals(prev.changes, cur.changes); 
            }),
            map(d => d.entities)
        );

        return selector$;
    }

    removeAll(){
        this.update(draft => {
            draft.entities = [];
            draft.metadata = {};
        });
    }

    removeOne(key:Key){
        return this.removeMany([key]);
    }
    removeMany(filter:Selector<E>){
        // ⚠️ This method may be inefficient since it has to re-index the collection when you remove an item.

        let ids:Key[] = [];
        
        if (isFunction(filter)){
            // predicate param - find the actual indexes
            ids = this.value.entities.filter(filter).map(e => this.getId(e));
        } else 
            ids = filter;

        // actual remove
        if (ids.length > 0){
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
                for(let idx of indeces){
                    draft.entities.splice(idx+shift, 1);
                    shift--;
                }

                // re-index the whole db from the first altered index
                for(let i:number=indeces[0];i<draft.entities.length;i++){
                    const id = this.getId(draft.entities[i]);
                    
                    draft.metadata[id].index = i;
                }
            })
        }
    }

    updateOne(id:Key, entity:Partial<E> | ((entity:E) => void)){
        // check id exists
        const idx = this.getIndex(id);
        if (idx === undefined)
            return;

        const current = this.value.entities[idx];
        let newEntity:E;

        // apply transformation
        if (isFunction(entity))
            newEntity = produce(current,entity);
        else 
            newEntity = deepApply(current,entity);
        
        // update the store
        this.update(draft => {
            draft.entities[idx] = newEntity;
            draft.metadata[id].change = this.getChangeUID();
        })
    }
    updateMany(ids:Key[], updater:Subset<E> | ((entity:E) => void)) {

        const indexes = ids.map(id => ({ id, idx: this.getIndex(id)})).filter(idx => idx.idx != undefined);

        if (indexes.length == 0)
            return; 
        
        this.update(draft => {
            if (isFunction(updater))
                indexes.forEach(meta => {
                    draft.entities[meta.idx] = produce(draft.entities[meta.idx], updater);
                    draft.metadata[meta.id].change = this.getChangeUID();
                })
            else 
                indexes.forEach(meta => {
                    draft.entities[meta.idx] = deepApply(draft.entities[meta.idx], updater);
                    draft.metadata[meta.id].change = this.getChangeUID();
                })
        })
    }
    updateAll(updater:Partial<E> | ((entity:E) => void)){
        this.update(draft => {
            if (isFunction(updater))
                draft.entities = draft.entities.map(e => produce(e, updater))
            else 
                draft.entities = draft.entities.map(e => deepApply(e, updater));
            
            // update all the change uids
            const change = this.getChangeUID();
            for(let id in draft.metadata)
                draft.metadata[id].change = change;
        })
    }

    insertOne(entity:E){
        this.updateEntities([entity], false);
    }
    insertMany(entities:E[]){
        this.updateEntities(entities, false);
    }

    upsertOne(entity:E){
        this.updateEntities([entity], true);
    }
    upsertMany(entities:E[]){
        this.updateEntities(entities, true);
    }


  
    private updateEntities(entities:E[], replace:boolean){
        this.update(draft => {
            const createMap:{ [key:Key]:E } = {};
            const updateMap:{ [key:Key]:E } = {};   

            entities.forEach(e => {
                const id = this.getId(e);
                // check if it exists and if it can update
                if (draft.metadata[id] != undefined){
                    if (replace)
                        updateMap[id] = e;
                }
                // if it doesn't, create it
                else
                    createMap[id] = e;
            });
            // update each entitity
            for (let id in updateMap){
                draft.entities[this.getIndex(id, draft)] = deepFreeze(updateMap[id]);
            }
            // Create new entities
            for(let id in createMap){
                // generate a new IDx
                const idx = draft.entities.length;

                // use it to push data in both array and index map
                draft.entities[idx] = deepFreeze(createMap[id]);
                draft.metadata[id] = {
                    index: idx,
                    change: this.getChangeUID()
                }
            }
        });
    }

    private getChangeUID(){
        return ++this._changeUID;
    }
    private getId(entity:any) {
        return entity[this.config.idKey];
    }
}


interface User {
    _id:string;
}
interface UserTableData {
    filter:string;
}

const table = new TableStore<User, UserTableData>({
    filter:''
});

