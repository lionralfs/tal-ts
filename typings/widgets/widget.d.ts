import { Application } from '../application';
import { BaseClass } from '../class';
export interface IWidget {
    addClass(className: string): void;
    getCurrentApplication(): Application;
    getClasses(): string[];
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
    outputElement: Node;
    private classNames;
    private eventListeners;
    private dataItem;
    private isFocussed;
    constructor(id?: string);
    addClass(className: any): void;
    getClasses(): string[];
    getCurrentApplication(): Application;
    show(options: IShowOptions): void;
}
