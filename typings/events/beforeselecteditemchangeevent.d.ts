import { Widget } from '../widgets/widget';
import { BaseEvent } from './event';
/**
 * Class of events raised when a List has been scrolled to another item.
 */
export declare class BeforeSelectedItemChangeEvent extends BaseEvent {
    target: Widget;
    item: Widget;
    index: number;
    /**
     * @param target The list that has changed.
     * @param item The list item that has been selected.
     * @param index The inex of the list item that has been selected.
     */
    constructor(target: Widget, item: Widget, index: number);
}
