"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStore = void 0;
const immer_1 = require("immer");
const rxjs_1 = require("rxjs");
const deep_apply_1 = require("./utils/deep-apply");
const deep_freeze_1 = require("./utils/deep-freeze");
const is_function_1 = require("./utils/is-function");
class SimpleStore {
    constructor(initialState, scope = 'global') {
        // Store Configuration
        this.scope = '';
        this.storeName = '';
        this.currentState = (0, deep_freeze_1.deepFreeze)(initialState);
        this.initialState = this.currentState;
        this.scope = scope;
        this.store = new rxjs_1.BehaviorSubject(initialState);
    }
    injectConfiguration(config, storeName) {
        this.config = config;
        this.storeName = storeName;
        this.initPersistance();
        // wait for previous value to arrive
        this.loadPreviousValue().pipe((0, rxjs_1.take)(1), (0, rxjs_1.catchError)(err => {
            console.warn('Error restoring saved value from previous session: ', err);
            return (0, rxjs_1.of)(null);
        })).subscribe(prevValue => {
            // previous value has arrived
            if (prevValue) {
                this.setStoreValue((0, deep_apply_1.deepApply)(this.value, prevValue));
            }
        });
    }
    getScope() { return this.scope; }
    getName() { return this.storeName; }
    /**
     * Return the current state, synchronously
     */
    get value() {
        return this.currentState;
    }
    /**
     * Get notified whenever the store changes in any way
     * @returns A stream that emits everytime the store changes in any way, emitting also the previous version of the state
     */
    storeChanged$() {
        return this.store.asObservable().pipe((0, rxjs_1.pairwise)(), (0, rxjs_1.map)(([prev, current]) => ({ prev, current })));
    }
    /** Selects a portion of the current state, will emit when the selected state part changes */
    select(project) {
        return this.store.asObservable().pipe((0, rxjs_1.map)(state => project(state)), (0, rxjs_1.distinctUntilChanged)());
    }
    /** Changes the current state value */
    update(updater) {
        let newState;
        if ((0, is_function_1.isFunction)(updater))
            newState = (0, immer_1.default)(this.currentState, updater);
        else {
            newState = (0, deep_apply_1.deepApply)(this.currentState, updater);
        }
        // update the store itself
        this.setStoreValue(newState);
    }
    setStoreValue(newState) {
        this.currentState = newState;
        this.store.next(this.currentState);
    }
    /** Reset the store to its default state */
    reset() {
        this.currentState = this.initialState;
        this.store.next(this.currentState);
    }
    initPersistance() {
        if (this.config.persist === false)
            return;
        // create the manager
        this.persistenceManager = new this.config.persist(this);
        // listen for any change in the store
        this.select(s => s).subscribe(state => {
            var _a;
            // state has changed
            (_a = this.persistenceManager) === null || _a === void 0 ? void 0 : _a.save(state);
        });
    }
    loadPreviousValue() {
        if (!this.persistenceManager)
            return (0, rxjs_1.of)(null);
        return (0, rxjs_1.defer)(() => this.persistenceManager.load());
    }
}
exports.SimpleStore = SimpleStore;
