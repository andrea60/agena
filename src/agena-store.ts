import { AgenaStoreConfig, getDefaultConfig } from "./agena-store-config";

type Ctor = { new (...args:any[]): any }

export function AgenaStore(config:Partial<AgenaStoreConfig>){
    
    return function<T extends Ctor>(StoreClass:T){
        return class extends StoreClass {
            // Inject configuration
            config:AgenaStoreConfig = {...getDefaultConfig(), ...config};
            storeName:string = StoreClass.name
        }
    }
}