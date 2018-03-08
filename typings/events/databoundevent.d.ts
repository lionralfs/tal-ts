import { BaseEvent } from './event';
/**
 * Class of events raised before and after databinding of a List.
 */
export declare class DataBoundEvent extends BaseEvent {
    /**
     * @param {String} type The type of the event.
     * @param {antie.widgets.List} target The list that has received data.
     * @param {antie.Iterator} iterator An iterator to the data that has been bound to the list.
     * @param {Object} error Error details (if applicable to the event type).
     */
    constructor(type: string, target: any, iterator: any, error: any);
}
