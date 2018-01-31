import { Application } from '../application';
import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { BaseEvent } from '../events/event';
import { RuntimeContext } from '../runtimecontext';
import { ComponentContainer } from './componentcontainer';
import { Container } from './container';

export interface IWidget {
  addClass(className: string): void;
  fireEvent(ev: BaseEvent);
  bubbleEvent(ev: BaseEvent);
  isFocusable(): boolean;
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
  public parentWidget: Container;
  public outputElement: HTMLElement;
  public focussed: boolean;

  private classNames: object;
  private eventListeners: { [key: string]: Array<(...args: any[]) => void> };
  private dataItem: object;

  constructor(id?: string) {
    super();

    this.classNames = { widget: true };
    this.parentWidget = null;
    this.outputElement = null;
    this.eventListeners = {};
    this.dataItem = null; // Any data item bound to this widget
    this.focussed = false;

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

  /**
   * Add an event listener function to this widget.
   * @param ev The event type to listen for (e.g. `keydown`)
   * @param func The handler to be called when the event is fired.
   */
  public addEventListener(ev: string, func: (...args: any[]) => void) {
    let listeners = this.eventListeners[ev];
    if (typeof listeners === 'undefined') {
      listeners = [];
      this.eventListeners[ev] = listeners;
    }
    if (listeners.indexOf(func) === -1) {
      listeners.push(func);
    }
  }

  public fireEvent(ev) {
    const listeners = this.eventListeners[ev.type];
    if (listeners) {
      for (const func in listeners) {
        if (listeners.hasOwnProperty(func)) {
          try {
            listeners[func](ev);
          } catch (exception) {
            const logger = this.getCurrentApplication()
              .getDevice()
              .getLogger();
            logger.error(
              `Error in ${ev.type} event listener on widget ${this.id}: ${exception.message}`,
              exception,
              listeners[func]
            );
          }
        }
      }
    }
  }

  public bubbleEvent(ev: BaseEvent) {
    this.fireEvent(ev);
    if (!ev.isPropagationStopped()) {
      if (this.parentWidget) {
        this.parentWidget.bubbleEvent(ev);
      } else {
        ev.stopPropagation();
      }
    }
  }

  /**
   * Checks to see if a widget is focussable, i.e. contains an enabled button.
   */
  public isFocusable(): boolean {
    // a widget can receive focus if any of it's children or children-of-children are Buttons
    // We're not a button and we have no children, so we're not.
    return false;
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

  /**
   * Hides a widget. If animation is enabled the widget will be faded out of view.
   * Returns `true` if animation was called, otherwise `false`
   */
  public hide(options?: {
    skipAnim?: boolean;
    onComplete?: () => void;
    fps?: number;
    duration?: number;
    easing?: string;
  }) {
    if (this.outputElement) {
      const newOptions = { ...options, el: this.outputElement };
      const device = this.getCurrentApplication().getDevice();
      device.hideElement(newOptions);
    } else {
      throw new Error('Widget::hide called - the current widget has not yet been rendered.');
    }
  }

  public removeFocus() {
    this.removeClass('focus');
    this.focussed = false;
  }

  /**
   * Get if this widget is in the current focus path.
   * returns `true` if this widget is in the focus path, otherwise `false`.
   */
  public isFocussed(): boolean {
    return this.focussed;
  }

  /**
   * Returns whether the widget is a Component, `true` if the widget is a Component.
   */
  public isComponent() {
    return false;
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

  public abstract render(device: Device): HTMLElement;
}
