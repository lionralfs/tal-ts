import { Device } from '../devices/device';
import { Widget } from './widget';
/**
 * The Label widget displays text. It supports auto-truncation (with ellipsis) of text to fit.
 */
export declare class Label extends Widget {
    /**
     * Do not truncate the text. Let the browser wrap to as many lines required to display all the text.
     */
    static TRUNCATION_MODE_NONE: boolean;
    /**
     * Truncate text to fit into the number of lines specified by {@link antie.widgets.Label#setMaximumLines}
     * by removing characters at the end of the string and append an ellipsis if text is truncated.
     */
    static TRUNCATION_MODE_RIGHT_ELLIPSIS: boolean;
    private text;
    private truncationMode;
    private maxLines;
    private enableHTML;
    private width;
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used
     * (but not included in any output).
     * @param text The text content of this label.
     */
    constructor(id?: string, text?: string, enableHTML?: boolean);
    /**
     * Renders the widget and any child widgets to device-specific output.
     *
     * Returns a device-specific object that represents the widget as displayed
     * on the device (in a browser, a DOMElement);
     * @param device The device to render to.
     */
    render(device: Device): HTMLElement;
    /**
     * Will return text as rendered on the device
     *
     * Returns a string that will be displayed in the label after truncation, etc...
     * @param device The device to render to.
     */
    getTextAsRendered(device: Device): string;
    /**
     * Sets the text displayed by this label.
     * @param text The new text to be displayed.
     */
    setText(text: string): void;
    /**
     * Gets the current text displayed by this label.
     * @returns The current text displayed by this label.
     */
    getText(): string;
    /**
     * Sets the truncation mode (currently {@link antie.widgets.Label.TRUNCATION_MODE_NONE} or
     * {@link antie.widgets.Label.TRUNCATION_MODE_RIGHT_ELLIPSIS}).
     *
     * @deprecated TRUNCATION_MODE_RIGHT_ELLIPSIS relies on browserdevice.getTextHeight(), which can be inaccurate.
     * @param mode The new truncation mode.
     */
    setTruncationMode(mode: boolean): void;
    /**
     * Sets the maximum lines displayed when a truncation mode is set.
     * @param lines The maximum number of lines to display.
     */
    setMaximumLines(lines: number): void;
    /**
     * Sets the width of this label for use with truncation only.
     * @param width The width of this label in pixels
     */
    setWidth(width: number): void;
}
