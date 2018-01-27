import { Application } from '../application';
import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { ComponentContainer } from './componentcontainer';
export interface IWidget {
    addClass(className: string): void;
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
    parentWidget: ComponentContainer;
    outputElement: Node;
    isFocussed: boolean;
    private classNames;
    private eventListeners;
    private dataItem;
    constructor(id?: string);
    addClass(className: any): void;
    getClasses(): string[];
    getCurrentApplication(): Application;
    show(options: IShowOptions): void;
    removeFocus(): void;
    removeClass(className: string): void;
    render(device: Device): void;
}
