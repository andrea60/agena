import { AgenaStoreConfig, getDefaultConfig } from "./agena-store-config";

type Ctor = { new (...args:any[]): any }

export function AgenaStore(config:Partial<AgenaStoreConfig>){
    return function(StoreClass:Ctor){
        StoreClass.prototype['storeName'] = StoreClass.name;
        StoreClass.prototype['config'] = {...getDefaultConfig(), ...config};
    }
}