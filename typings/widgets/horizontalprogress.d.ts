import { Device } from '../devices/device';
import { Container } from './container';
/**
 * The horizontal progress widget provides a UI control for showing progress (with associated label)
 */
export declare class HorizontalProgress extends Container {
    private value;
    private moveHandle;
    private lastLeft;
    private label;
    private leftElement;
    private innerElement;
    /**
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param showLabel Pass <code>true</code> to show a label that indicates the value of the progress shown.
     * @param initialValue The initial value (default 0).
     */
    constructor(id?: string, showLabel?: boolean, initialValue?: number);
    /**
     * Renders the widget and any child widgets to device-specific output.
     * @param device The device to render to.
     * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
     */
    render(device: Device): HTMLElement;
    /**
     * Returns the current value shown by the progress indicator.
     */
    getValue(): number;
    /**
     * Sets the current value to be shown by the progress indicator.
     * @param val The value to show (between 0.0 and 1.0 inclusive).
     */
    setValue(val: number): void;
    /**
     * Sets the text to show in the label.
     * @param val The text to show.
     */
    setText(val: string): void;
    /**
     * Moves the inner element to show the current value.
     */
    private moveInner();
}
