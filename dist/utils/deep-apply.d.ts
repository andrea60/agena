import { Subset } from "../subset.type";
export declare function deepApply<T extends object>(source: T, recipe: Subset<T>): T;
