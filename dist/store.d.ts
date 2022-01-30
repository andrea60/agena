import { Observable } from "rxjs";
import { Subset } from "./subset.type";
export declare class SimpleStore<S extends object> {
    private currentState;
    private store;
    private initialState;
    constructor(initialState: S);
    protected get value(): S;
    /** Selects a portion of the current state, will emit when the selected state part will change */
    protected select<R>(project: (state: S) => R): Observable<R>;
    /** Changes the current state value */
    protected update(updater: Subset<S> | ((draft: S) => void)): void;
    /** Reset the store to its default state */
    protected reset(): void;
}
