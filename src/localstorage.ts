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
    load(): Promise<Subset<any>> {
        return new Promise(resolve => {
            const serialized = localStorage.getItem(this.keyName);
            if (!serialized)
                resolve(null);
            resolve(JSON.parse(serialized));
        });
    }
    isAvailable(): boolean {
        return true; // for later use
    }

}