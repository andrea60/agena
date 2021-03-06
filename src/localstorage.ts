import { defer, Observable, of } from "rxjs";
import { IPersistenceManager } from "./persistence-manager.interface";
import { SimpleStore } from "./store";
import { Subset } from "./subset.type";

export class LocalStoragePersistance implements IPersistenceManager<any> {
    
    scope:string = '';
    name:string = '';
    constructor(store: SimpleStore<any>) {
        this.scope = store.getScope();
        this.name = store.getName();
    }

    get keyName() {
        return `${this.name}.${this.scope}`;
    }

    save(state: Subset<any>) {
        const serialized = JSON.stringify(state);
        localStorage.setItem(this.keyName, serialized);
    }
    load(): Observable<Subset<any>> {
        return defer(() => {
            const serialized = localStorage.getItem(this.keyName);
            if (!serialized)
                return of(null);
            return of(JSON.parse(serialized) as Subset<any>);
        });
    }
    isAvailable(): boolean {
        return true; // for later use
    }

}