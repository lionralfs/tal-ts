import { Device } from '../devices/base/device';
import { Container } from './container';
/**
 * The Button widget class represents a container widget which can receive focus and be selected/activated by the user.
 */
export declare class Button extends Container {
    private focusDelayHandle;
    private focusDelayTimeout;
    private disabled;
    /**
     * Creates a new button instance
     * @extends antie.widgets.Container
     * @param id The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
     * @param animationEnabled If true, a focus delay will be set before displaying the button
     */
    constructor(id?: string, animationEnabled?: boolean);
    /**
     * Renders the widget and any child widgets to device-specific output.
     *
     * Returns a device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
     * @param device The device to render to.
     */
    render(device: Device): HTMLElement;
    /**
     * Checks to see if a widget is focusable.
     * Returns `true` if the button is enabled.
     */
    isFocusable(): boolean;
    /**
     * Set the button to be disabled and therefore not focusable. Adds `buttonDisabled` class.
     * @param disabled `true` if the button is to be disabled.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Gives this button focus by setting active children back up the widget tree.
     * @param force Pass `true` to force focus to a disabled button.
     * Returns `true` if focus has been moved to the button. Otherwise returns `false`.
     */
    focus(force?: boolean): boolean;
    select(): void;
    removeFocus(): void;
    /**
     * Flags the active child as focussed or blurred.
     * @param focus True if the active child is to be focussed, False if the active child is to be blurred.
     */
    setActiveChildFocussed(focus: boolean): void;
}
