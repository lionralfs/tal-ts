import { Application } from '../application';
import { BaseClass } from '../class';
import { Device } from '../devices/device';
import { BaseEvent } from '../events/event';
import { RuntimeContext } from '../runtimecontext';
import { ComponentContainer } from './componentcontainer';
import { Container } from './container';

export interface IWidget {
  addClass(className: string): void;
  fireEvent(ev: BaseEvent): void;
  bubbleEvent(ev: BaseEvent): void;
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
  public static createUniqueID(): string {
    const res = '#' + new Date().getTime() + '_' + this.widgetUniqueIDIndex++;
    return res;
  }

  private static widgetUniqueIDIndex = 0;

  public id: string;
  public parentWidget: Container;
  public outputElement: HTMLElement;
  public focussed: boolean;
  public listIndex: number;

  private classNames: { [key: string]: boolean };
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

  public pushComponent(...args: any[]): void {
    throw new TypeError(`pushComponent called on Widget. Args: ${args}`);
  }

  public addClass(className: string): void {
    if (!this.classNames[className]) {
      this.classNames[className] = true;
      if (this.outputElement) {
        const device = this.getCurrentApplication().getDevice();
        device.setElementClasses(this.outputElement, this.getClasses());
      }
    }
  }

  /**
   * Checks to see if the widget has a given CSS class.
   * @param className The class name to check.
   * @return Boolean true if the device has the className. Otherwise boolean false.
   */
  public hasClass(className: string): boolean {
    return this.classNames[className] ? true : false;
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
  public addEventListener(ev: string, func: (...args: any[]) => void): void {
    let listeners = this.eventListeners[ev];
    if (typeof listeners === 'undefined') {
      listeners = [];
      this.eventListeners[ev] = listeners;
    }
    if (listeners.indexOf(func) === -1) {
      listeners.push(func);
    }
  }

  /**
   * Removes an event listener function to this widget.
   * @param ev The event type that the listener is to be removed from (e.g. <code>keydown</code>)
   * @param func The handler to be removed.
   */
  public removeEventListener(ev: string, func: (...args: any[]) => void): void {
    const listeners = this.eventListeners[ev];

    if (!listeners) {
      RuntimeContext.getDevice()
        .getLogger()
        .error('Attempting to remove non-existent event listener');
      return;
    }

    const listener = listeners.indexOf(func);
    if (listener !== -1) {
      listeners.splice(listener, 1);
    }
  }

  public fireEvent(ev: BaseEvent): void {
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

  public bubbleEvent(ev: BaseEvent): void {
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
   * Broadcast an event from object, triggering any event listeners bound to this widget and any
   * parent widgets.
   * To halt bubbling of the event, see `BaseEvent#stopPropagation`.
   * @param ev The event to bubble.
   */
  public broadcastEvent(ev: BaseEvent): void {
    this.fireEvent(ev);
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

  /**
   * Get any data item associated with this widget.
   */
  public getDataItem(): object {
    return this.dataItem;
  }

  /**
   * Associate a data item with this widget.
   * @param dataItem Object to associate with this widget.
   */
  public setDataItem(dataItem: object): void {
    this.dataItem = dataItem;
  }

  public show(options: IShowOptions): void {
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
  }): void {
    if (this.outputElement) {
      const newOptions = { ...options, el: this.outputElement };
      const device = this.getCurrentApplication().getDevice();
      device.hideElement(newOptions);
    } else {
      throw new Error('Widget::hide called - the current widget has not yet been rendered.');
    }
  }

  public removeFocus(): void {
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
  public isComponent(): boolean {
    return false;
  }

  public removeClass(className: string): void {
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
