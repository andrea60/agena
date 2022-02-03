import * as deepmerge from "deepmerge";
import produce from "immer";
import { BehaviorSubject, catchError, defer, distinctUntilChanged, from, map, Observable, of, pairwise, take } from "rxjs";
import { AgenaStoreConfig } from "./agena-store-config";
import { IPersistenceManager } from "./persistence-manager.interface";
import { Subset } from "./subset.type";
import { deepApply } from "./utils/deep-apply";
import { deepFreeze } from "./utils/deep-freeze";
import { isFunction } from "./utils/is-function";

export class SimpleStore<TState extends object> {
    // Store state
    protected currentState:TState;
    protected store:BehaviorSubject<TState>;
    protected initialState:TState;

    // Store Configuration
    protected scope:string = '';
    protected storeName:string = '';
    protected config:AgenaStoreConfig;

    // Helper objects
    protected persistenceManager?: IPersistenceManager<TState>;

    constructor(initialState:TState, scope:string='global'){
        this.currentState = deepFreeze(initialState);
        this.initialState = this.currentState;
        this.scope = scope;
    
        this.store = new BehaviorSubject<TState>(initialState);  
    }

    protected injectConfiguration(config:AgenaStoreConfig, storeName:string){
        this.config = config;
        this.storeName = storeName;

        this.initPersistance();
        // wait for previous value to arrive
        this.loadPreviousValue().pipe(
            take(1),
            catchError(err => {
                console.warn('Error restoring saved value from previous session: ', err);
                return of(null);
            })
        ).subscribe(prevValue => {
            // previous value has arrived
            if (prevValue){
                this.setStoreValue(deepApply(this.value, prevValue));
            }
        })
        
            
    }

    getScope(){ return this.scope; }
    getName(){ return this.storeName; }
    /**
     * Return the current state, synchronously
     */
    protected get value(){
        return this.currentState;
    }
    /**
     * Get notified whenever the store changes in any way
     * @returns A stream that emits everytime the store changes in any way, emitting also the previous version of the state
     */
    protected storeChanged$() {
        return this.store.asObservable().pipe(
            pairwise(),
            map(([prev, current]) => ({prev, current}))
        );
    }

    /** Selects a portion of the current state, will emit when the selected state part changes */
    protected select<R>(project: (state:TState) => R) : Observable<R> {
        return this.store.asObservable().pipe(
            map(state => project(state)),
            distinctUntilChanged()
        )
    }

    /** Changes the current state value */
    protected update(updater:Subset<TState> | ((draft:TState) => void)){
        let newState:TState;
        if (isFunction(updater))
            newState = produce(this.currentState, updater as (s:TState) => void);
        else {
            newState = deepApply(this.currentState, updater);
        }

        // update the store itself
        this.setStoreValue(newState);
    }

    private setStoreValue(newState:TState){
        this.currentState = newState;
        this.store.next(this.currentState);
    }

    /** Reset the store to its default state */
    protected reset(){
        this.currentState = this.initialState;
        this.store.next(this.currentState);
    }

    protected initPersistance(){
        if (this.config.persist === false)
            return;
        // create the manager
        this.persistenceManager = new this.config.persist(this);

        // listen for any change in the store
        this.select(s => s).subscribe(state => {
            // state has changed
            this.persistenceManager?.save(state);
        })
    }

    protected loadPreviousValue(){
        if (!this.persistenceManager)
            return of(null);
        return defer(() => this.persistenceManager.load());
    }
}