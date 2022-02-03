import { SimpleStore } from "../..";
import { AgenaStore } from "../../agena-store";

export interface SimpleState {
    x:number;
    a:{
        y:number;
    }
}
@AgenaStore({})
export class TestSimpleStore extends SimpleStore<SimpleState>{
    constructor(){
        super({
            x:0,
            a:{ y: 0 }
        })
    }
}