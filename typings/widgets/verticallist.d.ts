import { DataSource } from '../datasource';
import { Formatter } from '../formatter';
import { List } from './list';
/**
 * The VerticalList widget is a container widget that supports spatial navigation between items using `KeyEvent.VK_UP` and `KeyEvent.VK_DOWN`.
 */
export declare class VerticalList extends List {
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param itemFormatter A formatter class used on each data item to generate the list item child widgets.
     * @param dataSource An array of data to be used to generate the list items, or an asynchronous data source.
     */
    constructor(id?: string, itemFormatter?: Formatter, dataSource?: DataSource | any[]);
    /**
     * Key handler for vertical lists. Processes KeyEvent.VK_UP and KeyEvent.VK_DOWN keys and stops propagation
     * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
     * spatial navigation out of the list.
     * @param evt The key event.
     */
    private onKeyDown(evt);
}
