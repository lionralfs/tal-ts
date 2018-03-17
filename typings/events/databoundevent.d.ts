import { Iterator } from '../iterator';
import { Container } from '../widgets/container';
import { BaseEvent } from './event';
/**
 * Class of events raised before and after databinding of a List.
 */
export declare class DataBoundEvent extends BaseEvent {
    target: Container;
    iterator: Iterator<any>;
    error: object;
    /**
     * @param type The type of the event.
     * @param target The list that has received data.
     * @param iterator An iterator to the data that has been bound to the list.
     * @param error Error details (if applicable to the event type).
     */
    constructor(type: string, target: Container, iterator?: Iterator<any>, error?: object);
}
