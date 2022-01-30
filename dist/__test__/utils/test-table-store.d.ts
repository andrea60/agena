import { TableStore } from "../..";
export interface TestEntity {
    id: string;
    name: string;
    age: number;
    address: {
        city: string;
        postalCode: string;
    };
}
export declare function generateEntity(id: string, name?: string, age?: number, city?: string, postalCode?: string): TestEntity;
export declare class TestTableStore extends TableStore<TestEntity, {}> {
    constructor();
}
