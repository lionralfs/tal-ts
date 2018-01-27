import { Widget } from './widget';
export interface IContainer {
    getChildWidget(id: string): Widget;
}
export declare class Container extends Widget implements IContainer {
    private childWidgets;
    private childWidgetOrder;
    private activeChildWidget;
    private autoRenderChildren;
    constructor(id: string);
    getChildWidget(id: string): Widget;
}
