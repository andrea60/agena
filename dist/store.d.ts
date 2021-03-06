import { BehaviorSubject, Observable } from "rxjs";
import { AgenaStoreConfig } from "./agena-store-config";
import { IPersistenceManager } from "./persistence-manager.interface";
import { Subset } from "./subset.type";
export declare class SimpleStore<TState extends object> {
    protected currentState: TState;
    protected store: BehaviorSubject<TState>;
    protected initialState: TState;
    protected loadingState: boolean;
    protected loading: BehaviorSubject<boolean>;
    loading$: Observable<boolean>;
    protected scope: string;
    protected storeName: string;
    protected config: AgenaStoreConfig;
    protected persistenceManager?: IPersistenceManager<TState>;
    constructor(initialState: TState, scope?: string);
    getScope(): string;
    getName(): string;
    /**
     * Return the current state, synchronously
     */
    protected get value(): TState;
    /**
     * Get notified whenever the store changes in any way
     * @returns A stream that emits everytime the store changes in any way, emitting also the previous version of the state
     */
    protected storeChanged$(): Observable<{
        prev: TState;
        current: TState;
    }>;
    /** Selects a portion of the current state, will emit when the selected state part changes */
    protected select<R>(project: (state: TState) => R): Observable<R>;
    /** Changes the current state value */
    protected update(updater: Subset<TState> | ((draft: TState) => void)): void;
    protected setLoading(loading: boolean): void;
    private setStoreValue;
    /** Reset the store to its default state */
    protected reset(): void;
    protected initPersistance(): void;
    protected loadDefaultValue(): void;
    protected loadPreviousValue(): Observable<Subset<TState>>;
}
