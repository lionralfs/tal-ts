import { BaseClass } from '../class';
import { Widget } from './widget';

export interface IContainer {}

export class Container extends Widget implements IContainer {
  private childWidgets: object;
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
}
