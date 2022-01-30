export declare type Subset<T extends object> = {
    [K in keyof T]?: T[K] extends object ? Subset<T[K]> : T[K];
};
