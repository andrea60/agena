import { map, Observable, of, Subject, timer, timestamp } from "rxjs";
import { IPersistenceManager } from "../../persistence-manager.interface";
import { Subset } from "../../subset.type";

export class TestPersistanceManager implements IPersistenceManager<any> {
    savedValue:any;
    saveInvoke = new Subject<any>();
    saveInvoke$ = this.saveInvoke.asObservable();
    save(state: Subset<any>) {
        this.saveInvoke.next(state);
    }
    load(): Observable<Subset<any>> {
        return timer(100).pipe(map(() => this.savedValue));
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