import { Widget } from './widget';
export interface IContainer {
}
export declare class Container extends Widget implements IContainer {
    private childWidgets;
    private childWidgetOrder;
    private activeChildWidget;
    private autoRenderChildren;
    constructor(id: string);
}
