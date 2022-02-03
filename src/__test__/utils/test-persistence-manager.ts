import { Subject, timestamp } from "rxjs";
import { IPersistenceManager } from "../../persistence-manager.interface";
import { Subset } from "../../subset.type";

export class TestPersistanceManager implements IPersistenceManager<any> {
    savedValue:any;
    saveInvoke = new Subject<any>();
    saveInvoke$ = this.saveInvoke.asObservable();
    save(state: Subset<any>) {
        this.saveInvoke.next(state);
    }
    load(): Promise<Subset<any>> {

        return new Promise(resolve =>  { 
            resolve(this.savedValue); 
        });
    }
    isAvailable(): boolean {
        return true;
    }

}


export function createPersistanceManager(savedValue:any){
    return class extends TestPersistanceManager {
        constructor(...params:any[]){
            super();

            this.savedValue = savedValue;
        }
    }
}