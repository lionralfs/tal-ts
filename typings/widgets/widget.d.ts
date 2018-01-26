import { BaseClass } from '../class';
export interface IWidget {
    addClass(className: string): void;
}
export declare class Widget extends BaseClass implements IWidget {
    static widgetUniqueIDIndex: number;
    id: string;
    parentWidget: Widget;
    outputElement: Widget;
    private classNames;
    private eventListeners;
    private dataItem;
    private isFocussed;
    static createUniqueID(): string;
    constructor(id?: string);
    addClass(className: any): void;
    getCurrentApplication(): any;
}
