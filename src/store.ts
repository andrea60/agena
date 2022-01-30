import * as deepmerge from "deepmerge";
import produce from "immer";
import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs";
import { Subset } from "./subset.type";
import { deepApply } from "./utils/deep-apply";
import { deepFreeze } from "./utils/deep-freeze";
import { isFunction } from "./utils/is-function";

export class SimpleStore<S extends object> {
    private currentState:S;
    private store:BehaviorSubject<S>;
    private initialState:S;

    constructor(initialState:S){
        this.currentState = deepFreeze(initialState);
        this.initialState = this.currentState;

        this.store = new BehaviorSubject<S>(initialState);
    }

    protected get value(){
        return this.currentState;
    }

    /** Selects a portion of the current state, will emit when the selected state part will change */
    protected select<R>(project: (state:S) => R) : Observable<R> {
        return this.store.asObservable().pipe(
            map(state => project(state)),
            distinctUntilChanged()
        )
    }

    /** Changes the current state value */
    protected update(updater:Subset<S> | ((draft:S) => void)){
        let newState:S;
        if (isFunction(updater))
            newState = produce(this.currentState, updater as (s:S) => void);
        else {
            newState = deepApply(this.currentState, updater);
        }

        // update the store itself
        this.currentState = newState;
        this.store.next(this.currentState);
    }

    /** Reset the store to its default state */
    protected reset(){
        this.currentState = this.initialState;
    }


}