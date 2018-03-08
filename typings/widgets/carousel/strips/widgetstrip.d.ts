import { Container } from '../../container';
import { Widget } from '../../widget';
import { Orientation } from '../orientations/orientation';
/**
 * A container for the widgets displayed within a carousel
 */
export declare class WidgetStrip extends Container {
    private orientation;
    private lengths;
    /**
     *
     * @param id The unique ID of the widget.
     * @param orientation an object representing the strip's orientation.
     */
    constructor(id: string, orientation: Orientation);
    /**
     * Adds a widget to the end of the strip
     * @param widget The widget to append to the strip
     * @param length the length of the widget in pixels, measured along the primary axis.
     * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
     * positioning calculations rather then a calculated value (can be useful when widgets change size)
     * Note length only currently working with non-wrapping strips.
     */
    append(widget: Widget, length?: number): Widget;
    /**
     * Inserts widget within the strip
     * @param index A zero based index to begin insertion at, i.e. 0 prepends.
     * @param widget The widget to append to the strip
     * @param length the length of the widget in pixels, measured along the primary axis.
     * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
     * positioning calculations rather then a calculated value (can be useful when widgets change size)
     * Note length only currently working with non-wrapping strips.
     */
    insert(index: number, widget: Widget, length?: number): Widget;
    /**
     * Removes a widget from the strip
     * @param widget Widget to remove from the strip
     * @param retainElement Whether to keep the widget's output element in the DOM after removing widget
     */
    remove(widget: Widget, retainElement?: boolean): void;
    /**
     * Removes all widgets from the strip
     */
    removeAll(): void;
    /**
     * Get all the widgets in the strip.
     * @return The widgets currently in the strip
     */
    widgets(): Widget[];
    /**
     * Get the distance in pixels to a widget at the supplied index
     * @param index An index of a widget currently in the carousel
     * @return length in pixels along primary axis to primary edge of the provided index
     * i.e. from the left edge of the strip to the left edge of the widget in a horizontal carousel
     */
    getLengthToIndex(index: number): number;
    /**
     * Manually sets lengths of elements for movement calculations - useful for elements which change size while moving.
     * @param lengths If provided with a number all lengths will be set equal to this number
     * If provided with an array, the lengths will be set with the corresponding widgets (so the first number will be used
     * for the first widget's length, etc..)
     */
    setLengths(lengths: number | number[]): void;
    /**
     * Indicates whether the strip needs visible indices attaching before it is aligned
     * @return true if visible indices required, false if not.
     */
    needsVisibleIndices(): boolean;
    /**
     * Strip should ensure all widgets indexed in the array are attached to the parent
     * @param indexArray
     */
    attachIndexedWidgets(indexArray: number[]): void;
    /**
     * Gets the length in pixels of the widget at the supplied index.
     * @param index The index of a widget currently appended to the carousel. Supplied index must be valid (i.e. correspond to a wiget currently in the strip)
     * @return the length in pixels of the widget at the supplied index. Returns the length supplied at append or via setWidgetLength, if neither are specified attempts to calculate and return the length.
     */
    lengthOfWidgetAtIndex(index: number): number;
    /**
     * Manually performs any processing required to put the carousel in a valid state after an append/insert
     */
    recalculate(): void;
    /**
     * Toggles autocalculation - Calculation in this context is any strip defined processing required after an append/insert to put the carousel in a valid state.
     * @param on Turns autocalculation on (when true) or off (when false)
     * Calculation is any strip defined processing required after an append/insert to put the carousel in a valid state
     * Autocalculation is on by default when a carousel is created.
     */
    autoCalculate(on: boolean): void;
    private lengthToIndexByCalculatingUsingElements(index);
    private lengthToIndexUsingSuppliedValues(index);
    private getValidatedIndex(array, index);
    private getOffsetToLastElementInArray(elementArray);
    private getElementOffset(element);
    private getDevice();
    private getDimension();
    private getEdge();
    private getWidgetLength(widget);
    private getElementLength(element);
}
