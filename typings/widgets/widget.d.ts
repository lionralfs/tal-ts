import { Application } from '../application';
import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { BaseEvent } from '../events/event';
export interface IWidget {
    addClass(className: string): void;
    fireEvent(ev: BaseEvent): any;
    bubbleEvent(ev: BaseEvent): any;
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
    parentWidget: Widget;
    outputElement: HTMLElement;
    isFocussed: boolean;
    private classNames;
    private eventListeners;
    private dataItem;
    constructor(id?: string);
    addClass(className: any): void;
    getClasses(): string[];
    fireEvent(ev: any): void;
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
    hide(options: {
        el: HTMLElement;
        skipAnim: boolean;
        onComplete?: () => void;
        fps?: number;
        duration?: number;
        easing?: string;
    }): void;
    removeFocus(): void;
    removeClass(className: string): void;
    abstract render(device: Device): HTMLElement;
}
