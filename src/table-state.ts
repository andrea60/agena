export interface TableState<E> {
    entities:E[],
    metadata:{ [key:Key]: { index:number, change:number} }
}

export type Key = string | number;