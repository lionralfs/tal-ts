import { BaseClass } from '../class';
import { Widget } from './widget';

export interface IContainer {
  getChildWidget(id: string): Widget;
}

export class Container extends Widget implements IContainer {
  private childWidgets: { [key: string]: Widget };
  private childWidgetOrder: Widget[];
  private activeChildWidget: Widget;
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
}
