import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { IWidget, Widget } from './widget';

export interface IContainer {
  getChildWidget(id: string): Widget;
}

export class Container extends Widget implements IContainer {
  public activeChildWidget: Container;
  public childWidgets: { [key: string]: Widget };
  private childWidgetOrder: Widget[];
  private autoRenderChildren: boolean;

  constructor(id: string) {
    super();

    this.childWidgets = {};
    this.childWidgetOrder = [];
    this.activeChildWidget = null;
    this.autoRenderChildren = true;

    this.addClass('container');
  }

  public getChildWidget(id: string): Widget {
    return this.childWidgets[id];
  }

  public render(device: Device) {
    let i;
    if (!this.outputElement) {
      this.outputElement = device.createContainer(this.id, this.getClasses());
    } else {
      device.clearElement(this.outputElement);
    }
    for (i = 0; i < this.childWidgetOrder.length; i++) {
      device.appendChildElement(this.outputElement, this.childWidgetOrder[i].render(device));
    }
    return this.outputElement;
  }
}
