import { BaseClass } from '../class';
import { RuntimeContext } from '../runtimecontext';

// TODO: write interface

export abstract class Event extends BaseClass {
  public static addEventListener(ev: string, func: () => void) {
    let listeners = Event.eventListeners[ev];
    if (typeof listeners === 'undefined') {
      listeners = [];
      this.eventListeners[ev] = listeners;
    }
    if (listeners.indexOf(func) < 0) {
      listeners.push(func);
    }
  }

  public static removeEventListener(ev: string, func: () => void) {
    const listeners = this.eventListeners[ev];
    let listener;

    if (!listeners) {
      RuntimeContext.getDevice()
        .getLogger()
        .error('Attempting to remove non-existent event listener');
      return false;
    }

    listener = listeners.indexOf(func);
    if (listener >= 0) {
      listeners.splice(listener, 1);
    }
  }

  public static fireEvent(ev: string) {
    const listeners = this.eventListeners[ev];
    if (listeners) {
      for (const func in listeners) {
        if (listeners.hasOwnProperty(func)) {
          listeners[func]();
        }
      }
    }
  }

  private static eventCount: number = 0;
  private static eventListeners: { [key: string]: Array<() => void> } = {};

  public type: string;

  private propagationStopped: boolean;
  private defaultPrevented: boolean;

  constructor(type: string) {
    super();
    this.type = type;
    this.propagationStopped = false;
    this.defaultPrevented = false;
    Event.eventCount++;
  }

  public stopPropagation() {
    this.propagationStopped = true;
    Event.eventCount--;
    if (!Event.eventCount) {
      Event.fireEvent('emptyStack');
    }
  }

  public isPropagationStopped() {
    return this.propagationStopped;
  }

  public preventDefault() {
    this.defaultPrevented = true;
  }

  public isDefaultPrevented() {
    return this.defaultPrevented;
  }
}
