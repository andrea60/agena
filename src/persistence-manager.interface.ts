import { Observable } from "rxjs";
import { SimpleStore } from ".";
import { Subset } from "./subset.type";

export interface IPersistenceManager<TState extends {}> {

    save(state:Subset<TState>);

    load():Observable<Subset<TState>>;

    isAvailable():boolean;

}