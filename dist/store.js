"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStore = void 0;
const immer_1 = require("immer");
const rxjs_1 = require("rxjs");
const deep_apply_1 = require("./utils/deep-apply");
const deep_freeze_1 = require("./utils/deep-freeze");
const is_function_1 = require("./utils/is-function");
class SimpleStore {
    constructor(initialState) {
        this.currentState = (0, deep_freeze_1.deepFreeze)(initialState);
        this.initialState = this.currentState;
        this.store = new rxjs_1.BehaviorSubject(initialState);
    }
    get value() {
        return this.currentState;
    }
    /** Selects a portion of the current state, will emit when the selected state part will change */
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
        this.currentState = newState;
        this.store.next(this.currentState);
    }
    /** Reset the store to its default state */
    reset() {
        this.currentState = this.initialState;
    }
}
exports.SimpleStore = SimpleStore;