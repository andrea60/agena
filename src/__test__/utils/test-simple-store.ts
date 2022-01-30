import { SimpleStore } from "../..";

export interface SimpleState {
    x:number;
    a:{
        y:number;
    }
}

export class TestSimpleStore extends SimpleStore<SimpleState>{
    constructor(){
        super({
            x:0,
            a:{ y: 0 }
        })
    }
}