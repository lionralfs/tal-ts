import { Application } from '../application';
import { BaseClass } from '../class';
import { RuntimeContext } from '../runtimecontext';

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

export abstract class Widget extends BaseClass implements IWidget {
  public static createUniqueID() {
    const res = '#' + new Date().getTime() + '_' + this.widgetUniqueIDIndex++;
    return res;
  }

  private static widgetUniqueIDIndex = 0;

  public id: string;
  public parentWidget: Widget;
  public outputElement: Node;

  private classNames: object;
  private eventListeners: object;
  private dataItem: object;
  private isFocussed: boolean;

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

  public addClass(className) {
    if (!this.classNames[className]) {
      this.classNames[className] = true;
      if (this.outputElement) {
        const device = this.getCurrentApplication().getDevice();
        device.setElementClasses(this.outputElement, this.getClasses());
      }
    }
  }

  public getClasses(): string[] {
    const names = [];
    for (const i in this.classNames) {
      if (this.classNames.hasOwnProperty(i)) {
        names.push(i);
      }
    }
    return names;
  }

  public getCurrentApplication(): Application {
    return RuntimeContext.getCurrentApplication();
  }

  public show(options: IShowOptions) {
    if (this.outputElement) {
      options.el = this.outputElement;
      const device = this.getCurrentApplication().getDevice();
      device.showElement(options);
    } else {
      throw new Error('Widget::show called - the current widget has not yet been rendered.');
    }
  }
}
