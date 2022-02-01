import { IPersistenceManager } from "./persistence-manager.interface";

export interface AgenaStoreConfig {
    idKey:string;
    persist: false | { new (...args:any[]): IPersistenceManager<any> };
}


export function getDefaultConfig(): AgenaStoreConfig{
    return {
        idKey:'id',
        persist: false
    }
}