import { BaseClass } from '../class';
import { RuntimeContext } from '../runtimecontext';

export interface IWidget {
  addClass(className: string): void;
}

export class Widget extends BaseClass implements IWidget {
  static widgetUniqueIDIndex = 0;

  public id: string;
  public parentWidget: Widget;
  public outputElement: Widget;

  private classNames: object;
  private eventListeners: object;
  private dataItem: object;
  private isFocussed: boolean;

  static createUniqueID() {
    const res = '#' + new Date().getTime() + '_' + this.widgetUniqueIDIndex++;
    console.log(res);
    return res;
  }

  constructor(id?: string) {
    super();

    this.classNames = { widget: true };
    this.parentWidget = null;
    this.outputElement = null;
    this.eventListeners = {};
    this.dataItem = null; // Any data item bound to this widget
    this.isFocussed = false;

    // ensure all widgets have an ID
    this.id = id ? id : Widget.createUniqueID();
  }

  addClass(className) {
    if (!this.classNames[className]) {
      this.classNames[className] = true;
      if (this.outputElement) {
        const device = this.getCurrentApplication().getDevice();
        device.setElementClasses(this.outputElement, this.getClasses());
      }
    }
  }

  getCurrentApplication() {
    return RuntimeContext.getCurrentApplication();
  }
}