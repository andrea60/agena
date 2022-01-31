import { Observable } from "rxjs";
import { Subset } from "./subset.type";
export declare class SimpleStore<S extends object> {
    private currentState;
    private store;
    private initialState;
    constructor(initialState: S);
    /**
     * Return the current state, synchronously
     */
    protected get value(): S;
    /**
     * Get notified whenever the store changes in any way
     * @returns A stream that emits everytime the store changes in any way, emitting also the previous version of the state
     */
    protected storeChanged$(): Observable<{
        prev: S;
        current: S;
    }>;
    /** Selects a portion of the current state, will emit when the selected state part changes */
    protected select<R>(project: (state: S) => R): Observable<R>;
    /** Changes the current state value */
    protected update(updater: Subset<S> | ((draft: S) => void)): void;
    /** Reset the store to its default state */
    protected reset(): void;
}
