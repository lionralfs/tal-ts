import { Device } from '../devices/device';
import { Widget } from './widget';
export interface IContainer {
    getChildWidget(id: string): Widget;
}
export declare class Container extends Widget implements IContainer {
    activeChildWidget: Container;
    childWidgets: {
        [key: string]: Widget;
    };
    private childWidgetOrder;
    private autoRenderChildren;
    constructor(id: string);
    getChildWidget(id: string): Widget;
    render(device: Device): Node;
}
