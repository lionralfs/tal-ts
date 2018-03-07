import { Application } from '../application';
import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { BaseEvent } from '../events/event';
import { Container } from './container';
export interface IWidget {
    addClass(className: string): void;
    fireEvent(ev: BaseEvent): void;
    bubbleEvent(ev: BaseEvent): void;
    isFocusable(): boolean;
    getCurrentApplication(): Application;
    getClasses(): string[];
    removeFocus(): void;
    removeClass(className: string): void;
    render(device: Device): void;
}
export interface IShowOptions {
    skipAnim?: boolean;
    onComplete?: () => void;
    fps?: number;
    duration?: number;
    easing?: string;
    el?: Node;
}
export declare abstract class Widget extends BaseClass implements IWidget {
    static createUniqueID(): string;
    private static widgetUniqueIDIndex;
    id: string;
    parentWidget: Container;
    outputElement: HTMLElement;
    focussed: boolean;
    private classNames;
    private eventListeners;
    private dataItem;
    constructor(id?: string);
    pushComponent(...args: any[]): void;
    addClass(className: string): void;
    getClasses(): string[];
    /**
     * Add an event listener function to this widget.
     * @param ev The event type to listen for (e.g. `keydown`)
     * @param func The handler to be called when the event is fired.
     */
    addEventListener(ev: string, func: (...args: any[]) => void): void;
    /**
     * Removes an event listener function to this widget.
     * @param {String} ev The event type that the listener is to be removed from (e.g. <code>keydown</code>)
     * @param {Function} func The handler to be removed.
     * @see antie.events.Event
     */
    removeEventListener(ev: string, func: (...args: any[]) => void): boolean;
    fireEvent(ev: BaseEvent): void;
    bubbleEvent(ev: BaseEvent): void;
    /**
     * Checks to see if a widget is focussable, i.e. contains an enabled button.
     */
    isFocusable(): boolean;
    getCurrentApplication(): Application;
    show(options: IShowOptions): void;
    /**
     * Hides a widget. If animation is enabled the widget will be faded out of view.
     * Returns `true` if animation was called, otherwise `false`
     */
    hide(options?: {
        skipAnim?: boolean;
        onComplete?: () => void;
        fps?: number;
        duration?: number;
        easing?: string;
    }): void;
    removeFocus(): void;
    /**
     * Get if this widget is in the current focus path.
     * returns `true` if this widget is in the focus path, otherwise `false`.
     */
    isFocussed(): boolean;
    /**
     * Returns whether the widget is a Component, `true` if the widget is a Component.
     */
    isComponent(): boolean;
    removeClass(className: string): void;
    abstract render(device: Device): HTMLElement;
}
