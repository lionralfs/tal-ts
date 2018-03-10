import { Component } from '.';
import { BaseClass } from './class';
import { Iterator } from './iterator';

/**
 * Utility class to wrap disparate functions into a common interface for binding to lists.
 */
export class DataSource extends BaseClass {
  private request;
  private component: Component;
  private obj;
  private func: string;
  private args: any[];

  /**
   * @param component Component which 'owns' this data.
   * @param obj Object on which to call 'func' method.
   * @param func Name of function to call.
   * @param args Arguments to pass the function.
   */
  constructor(component: Component, obj: any, func: string, args?: any[]) {
    super();
    this.request = null;
    this.component = component;
    this.obj = obj;
    this.func = func;
    this.args = args;

    if (component) {
      const beforeHideListener = () => {
        component.removeEventListener('beforehide', beforeHideListener);
        this.abort();
      };
      component.addEventListener('beforehide', beforeHideListener);
    }
  }

  /**
   * Performs the request for data.
   * @param callbacks Object containing onSuccess and onError callback functions.
   */
  public load(callbacks: { onSuccess: (data: DataSource | any[]) => void; onError: (response?: object) => void }) {
    this.request = this.obj[this.func].apply(this.obj, [callbacks].concat(this.args || []));
  }

  /**
   * Aborts a currently loading request.
   */
  public abort() {
    if (this.request) {
      this.request.abort();
    }
  }
}
