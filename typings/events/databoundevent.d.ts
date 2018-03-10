import { Iterator } from '../iterator';
import { List } from '../widgets/list';
import { BaseEvent } from './event';
/**
 * Class of events raised before and after databinding of a List.
 */
export declare class DataBoundEvent extends BaseEvent {
    target: List;
    iterator: Iterator;
    error: object;
    /**
     * @param type The type of the event.
     * @param target The list that has received data.
     * @param iterator An iterator to the data that has been bound to the list.
     * @param error Error details (if applicable to the event type).
     */
    constructor(type: string, target: List, iterator?: Iterator, error?: object);
}
