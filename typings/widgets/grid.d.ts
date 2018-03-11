import { Device } from '../devices/device';
import { BaseEvent } from '../events/event';
import { Container } from './container';
import { Widget } from './widget';
/**
 * The Grid widget class represents a grid of widgets that may be navigated between using up/down/left/right.
 */
export declare class Grid extends Container {
    static WRAP_MODE: {
        HORIZONTAL: {
            ON: number;
            OFF: number;
        };
        VERTICAL: {
            ON: number;
            OFF: number;
        };
    };
    private cols;
    private rows;
    private horizontalWrapping;
    private verticalWrapping;
    private selectedRow;
    private selectedCol;
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param cols The number of columns in the grid.
     * @param rows The number of rows in the grid.
     * @param horizontalWrapping Enable or disable horizontal wrapping.
     * @param verticalWrapping Enable or disable vertical wrapping.
     */
    constructor(id: string, cols: number, rows: number, horizontalWrapping: boolean, verticalWrapping: boolean);
    /**
     * Get the widget positioned at the specified column and row.
     * @param col The column the widget it in
     * @param row The row the widget it in
     * @return The widget in the specified column and row
     */
    getWidgetAt(col: number, row: number): Widget;
    /**
     * Positions a widget at the specified column and row.
     * @param col The column to position the widget in
     * @param row The row to position the widget in
     * @param widget The widget to add
     */
    setWidgetAt(col: number, row: number, widget: Widget): void;
    /**
     * Renders the widget and any child widgets to device-specific output.
     * @param device The device to render to.
     * @return A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
     */
    render(device: Device): HTMLElement;
    /**
     * Appends a child widget to this widget. Not supported for Grids - use setWidgetAt() instead.
     * @param widget The child widget to add.
     */
    appendChildWidget(widget: Widget): Widget;
    /**
     * Inserts a child widget at the specified index. Not supported for Grids.
     * @param index The index where to insert the child widget.
     * @param widget The child widget to add.
     */
    insertChildWidget(index: number, widget: Widget): Widget;
    /**
     * Removes a specific child widget from this widget. Not supported for Grids.
     * @param widget The child widget to remove.
     * @param retainElement Pass `true` to retain the child output element of the given widget
     */
    removeChildWidget(widget: Widget, retainElement?: boolean): void;
    /**
     * Attempt to set focus to the given child widget.
     *
     * Note: You can only set focus to a focusable widget. A focusable widget is one that
     * contains an enabled antie.widgets.Button as either a direct or indirect child.
     *
     * Note: Widgets have 2 independant states: active and focussed. A focussed widget is
     * either the Button with focus, or any parent of that Button. An active widget is
     * one which is the active child of its parent Container. When the parent widget
     * receives focus, focus will be placed on the active child.
     *
     * Classes 'active' and 'focus' are appended to widgets with these states.
     *
     * @param widget The child widget to set focus to.
     * @return Boolean true if the child widget was focusable, otherwise boolean false.
     */
    setActiveChildWidget(widget: Widget): boolean;
    /**
     * Broadcasts an event from the application level to every single
     * object it contains.
     */
    broadcastEvent(evt: BaseEvent): void;
    /**
     * Key handler for grids. Processes KeyEvent.VK_UP, VK_DOWN, VK_LEFT and VK_RIGHT keys and stops propagation
     * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
     * spatial navigation out of the list.
     * @param evt The key event.
     */
    private onKeyDown(evt);
}
