import { AgenaStoreConfig, getDefaultConfig } from "./agena-store-config";

type Ctor = { new (...args:any[]): any }

export function AgenaStore(config:Partial<AgenaStoreConfig>){
    return function<T extends Ctor>(StoreClass:T){
        const actualConfig = {...getDefaultConfig(), ...config};
        return class extends StoreClass {
            
            injectConfiguration:(config:AgenaStoreConfig, storeName:string) => void;

            constructor(...params:any[]){
                // PROBLEMA!!
                super(params[0], params[1]);

                // Inject configuration
                this.injectConfiguration(actualConfig, StoreClass.name)
            }
            
        }
    }
}