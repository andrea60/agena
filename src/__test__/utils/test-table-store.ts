import { TableStore } from "../..";
import { AgenaStore } from "../../agena-store";

export interface TestEntity {
    id:string;
    name:string;
    age:number;
    address:{
        city:string;
        postalCode:string;
    }
}


export function generateEntity(id:string, name:string='Name', age:number=20, city:string='Gondor', postalCode:string='0000') : TestEntity {
    return {
        id,
        name,
        age,
        address:{
            city,
            postalCode
        }
    }
}
@AgenaStore({})
export class TestTableStore extends TableStore<TestEntity, {}>{
    constructor(){
        super({})
    }
}