import { SimpleStore } from ".";
import { Subset } from "./subset.type";

export interface IPersistenceManager<TState extends {}> {

    save(state:Subset<TState>);

    load():Subset<TState>;

    isAvailable():boolean;

}