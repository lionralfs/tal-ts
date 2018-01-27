import { Application } from '../application';
import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { RuntimeContext } from '../runtimecontext';
import { ComponentContainer } from './componentcontainer';

export interface IWidget {
  addClass(className: string): void;
  getCurrentApplication(): Application;
  getClasses(): string[];
  removeFocus(): void;
  removeClass(className: string): void;
  render(device: Device): void;
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
  public parentWidget: ComponentContainer;
  public outputElement: Node;
  public isFocussed: boolean;

  private classNames: object;
  private eventListeners: object;
  private dataItem: object;

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
      const newOptions = { ...options, el: this.outputElement };
      options.el = this.outputElement;
      const device = this.getCurrentApplication().getDevice();
      device.showElement(newOptions);
    } else {
      throw new Error('Widget::show called - the current widget has not yet been rendered.');
    }
  }

  public removeFocus() {
    this.removeClass('focus');
    this.isFocussed = false;
  }

  public removeClass(className: string) {
    if (this.classNames[className]) {
      delete this.classNames[className];
      if (this.outputElement) {
        const device = this.getCurrentApplication().getDevice();
        device.setElementClasses(this.outputElement, this.getClasses());
      }
    }
  }

  public render(device: Device) {
    throw new Error(
      "Widget::render called - the subclass for widget '" + this.id + "' must have not overridden the render method."
    );
  }
}
