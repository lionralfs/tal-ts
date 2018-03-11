import { DataSource } from '../datasource';
import { Formatter } from '../formatter';
import { List } from './list';
/**
 * The HorizontalList widget is a container widget that supports spatial navigation between items using `KeyEvent.VK_LEFT` and `KeyEvent.VK_RIGHT`.
 */
export declare class HorizontalList extends List {
    static WRAP_MODE_NONE: number;
    static WRAP_MODE_WRAP: number;
    private maskElement;
    private wrapMode;
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param itemFormatter A formatter class used on each data item to generate the list item child widgets.
     * @param dataSource An array of data to be used to generate the list items, or an aysnchronous data source.
     */
    constructor(id?: string, itemFormatter?: Formatter, dataSource?: DataSource | any[]);
    /**
     * Set whether to support wrapping within the list.
     * @param wrapMode Pass `HorizontalList.WRAP_MODE_NONE` for no wrapping.
     * Pass `HorizontalList.WRAP_MODE_NONE` to allow navigation to wrap.
     */
    setWrapMode(wrapMode: number): void;
    /**
     * Key handler for horizontal lists. Processes KeyEvent.VK_LEFT and KeyEvent.VK_RIGHT keys and stops propagation
     * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
     * spatial navigation out of the list.
     * @param evt The key event.
     */
    private onKeyDown(evt);
}
