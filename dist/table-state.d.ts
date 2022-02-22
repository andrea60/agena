export interface TableState<E> {
    entities: E[];
    metadata: {
        [key: Key]: {
            index: number;
            change: number;
        };
    };
}
export declare type Key = string | number;
