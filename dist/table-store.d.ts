import { Observable } from "rxjs";
import { SimpleStore } from "./store";
import { Subset } from "./subset.type";
import { Key, TableState } from "./table-state";
declare type Selector<E> = Key[] | ((entity: E) => boolean);
export declare class TableStore<E extends {}, S> extends SimpleStore<TableState<E> & S> {
    protected _changeUID: number;
    constructor(initialState: S, scope?: string);
    getEntity(id: Key): E;
    private getEntityFromState;
    private getIndex;
    private getChange;
    selectAll(): Observable<E[]>;
    selectOne(key: Key): Observable<E>;
    selectMany(filter: Selector<E>): Observable<E[]>;
    removeAll(): void;
    removeOne(key: Key): void;
    removeMany(filter: Selector<E>): void;
    updateOne(id: Key, entity: Partial<E> | ((entity: E) => void)): void;
    updateMany(ids: Key[], updater: Subset<E> | ((entity: E) => void)): void;
    updateAll(updater: Partial<E> | ((entity: E) => void)): void;
    insertOne(entity: E): void;
    insertMany(entities: E[]): void;
    upsertOne(entity: E): void;
    upsertMany(entities: E[]): void;
    private insert;
    private getChangeUID;
    private getId;
    protected entitiesUpdated(versions: {
        old: E;
        new: E;
    }[]): void;
    protected entitiesRemoved(entities: E[]): void;
    protected entitiesAdded(entities: E[]): void;
}
export {};
