import { SimpleStore } from ".."
import { AgenaStore } from "../agena-store"
import { IPersistenceManager } from "../persistence-manager.interface";
import { Subset } from "../subset.type";

class TestPersistance implements IPersistenceManager<{}> {
    __unique = '__TEST_PERSISTANCE__'
    save(state: Subset<{}>) {
        
    }
    load() {
        return new Promise(() => ({}));
    }
    isAvailable(): boolean {
        return true;
    }

}


@AgenaStore({
    idKey:'_X',
    persist: TestPersistance
})
class Store extends SimpleStore<{}>{

}


describe('AgenaStoreConfig decorator', function(){

    it('Injects class name', function(){
        const store = new Store({});

        expect(store.getName()).toBe('Store');
    })

    it('Injects idKey property', function(){
        const store = new Store({});
        expect(store['config'].idKey).toBe('_X');
    })

    it('Injects persistance class', function(){
        const store = new Store({});

        const expectedClass = new TestPersistance();
        // little hack to ensure the actual manager is of the same type
        expect(store['persistenceManager']['__unique']).toBe(expectedClass.__unique);
    })
})