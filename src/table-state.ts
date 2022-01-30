export interface TableState<E, S> {
    entities:E[],
    metadata:{ [key:Key]: { index:number, change:number} },
    custom:S;
}

export type Key = string | number;