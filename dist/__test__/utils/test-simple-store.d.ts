import { SimpleStore } from "../..";
export interface SimpleState {
    x: number;
    a: {
        y: number;
    };
}
export declare class TestSimpleStore extends SimpleStore<SimpleState> {
    constructor();
}
