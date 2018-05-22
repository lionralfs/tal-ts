import { DataSource } from '../datasource';
import { Device } from '../devices/base/device';
import { Formatter } from '../formatter';
import { Container } from './container';
import { HorizontalProgress } from './horizontalprogress';
import { Widget } from './widget';
/**
 * The List widget contains an ordered list of items which may be populated either by a static
 * array or by binding to an asynchronous data source.
 * Note: The List widget has no spatial navigation. See `VerticalList`
 * and `HorizontalList` for widgets that support spatial navigation.
 */
export declare class List extends Container {
    /**
     * Render as a generic container (e.g. <div>), with a generic container for each list item.
     */
    static RENDER_MODE_CONTAINER: number;
    /**
     * Render as a list (e.g. <ul>), with list item elements (e.g. <li>) for each item.
     */
    static RENDER_MODE_LIST: number;
    static DATA_BIND_FORWARD: number;
    static DATA_BIND_REVERSE: number;
    protected selectedIndex: number;
    private dataSource;
    private itemFormatter;
    private dataBound;
    private totalDataItems;
    private renderMode;
    private dataBindingOrder;
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param itemFormatter A formatter class used on each data item to generate the list item child widgets.
     * @param dataSource An array of data to be used to generate the list items, or an asynchronous data source.
     */
    constructor(id?: string, itemFormatter?: Formatter, dataSource?: DataSource | any[]);
    /**
     * Appends a child widget to this widget, creating a new list item.
     * @param widget The child widget to add.
     */
    appendChildWidget(widget: Widget): Widget;
    /**
     * Inserts a child widget at the specified index.
     * @param index The index where to insert the child widget.
     * @param widget The child widget to add.
     */
    insertChildWidget(index: number, widget: Widget): Widget;
    /**
     * Attempt to set focus to the given child widget.
     * Note: You can only set focus to a focusable widget. A focusable widget is one that
     * contains an enabled antie.widgets.Button as either a direct or indirect child.
     * @param widget The child widget to set focus to.
     * @return Boolean true if the child widget was focusable, otherwise boolean false.
     */
    setActiveChildWidget(widget: Widget): boolean;
    /**
     * Renders the widget and any child widgets to device-specific output. If the list is bound
     * to an asynchronous data source, get the data.
     * @param device The device to render to.
     * @return A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
     */
    render(device: Device): HTMLElement;
    /**
     * Binds the list to a different data source. If the list is already rendered,
     * the output will be updated to reflect the new data.
     * @param dataSource The data source to bind to.
     */
    setDataSource(dataSource: DataSource | any[]): void;
    /**
     * Invalidates the data-related bindings - causing items to be re-created on next render;
     */
    resetDataBindings(): void;
    /**
     * Re-iterates the data source, recreating list items.
     */
    rebindDataSource(): void;
    /**
     * Sets the rendering mode to either <code>List.RENDER_MODE_CONTAINER</code> or <code>List.RENDER_MODE_LIST</code>.
     * List.RENDER_MODE_CONTAINER causes the list to be rendered as a generic container (e.g. &lt;div&gt;), with a generic container for each
     * list item. List.RENDER_MODE_LIST causes the list to be rendered as a list (e.g. &lt;ul&gt;), with list item elements (e.g. &lt;li&gt;) for each item.
     * @param mode The rendering mode to use.
     */
    setRenderMode(mode: number): void;
    /**
     * Unbinds a previously-bound progress indicator widget.
     */
    unbindProgressIndicator(): void;
    removeChildWidget(widget: Widget): void;
    removeChildWidgets(): void;
    setDataBindingOrder(order: any): void;
    getDataBindingOrder(): number;
    /**
     * Binds a progress indicator widget to this list.
     * @param widget The progress indicator widget.
     * @param formatterCallback A function that takes the current item index and the total number of items and returns
     * a string to popular the progress indicator's label.
     */
    bindProgressIndicator(widget: HorizontalProgress, formatterCallback?: (currentIndex: number, total: number) => string): void;
    private updateProgressHandler(evt);
    /**
     * Create list items from the bound data.
     */
    private createDataBoundItems();
}
