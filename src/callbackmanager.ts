import { BaseClass } from './class';

/**
 * Utility class to deal with adding/removing callbacks and calling all current callbacks.
 */
export class CallbackManager extends BaseClass {
  private callbacks: Array<[object, () => void]>;

  constructor() {
    super();
    this.callbacks = [];
  }

  /**
   * Add a callback.
   *
   * Note that failing to remove callbacks when you are finished with them can stop garbage collection
   * of objects/closures containing those callbacks and so create memory leaks in your application.
   * @param thisArg The object to use as "this" when calling the callback.
   * @param callback The callback function
   */
  public addCallback(thisArg: object, callback: (...args: any[]) => void): void {
    if (this.getIndexOf(thisArg, callback) === undefined) {
      this.callbacks.push([thisArg, callback]);
    }
  }

  /**
   * Remove the specified callback.
   * @param {Object} thisArg The object that was used as "this" when adding the callback.
   * @param {Function} callback The callback function
   */
  public removeCallback(thisArg: object, callback: (...args: any[]) => void) {
    const foundIndex = this.getIndexOf(thisArg, callback);

    if (foundIndex !== undefined) {
      this.callbacks.splice(foundIndex, 1);
    }
  }

  /**
   * Remove all callbacks.
   */
  public removeAllCallbacks() {
    this.callbacks = [];
  }

  /**
   * Call all callbacks, providing all supplied arguments to each of the calls.
   * @example manager.callAll(1);
   * @example manager.callAll(1,2,3,4);
   */
  public callAll(...args: any[]) {
    this.callbacks.forEach(cbTuple => {
      cbTuple[1].apply(cbTuple[0], args);
    });
  }

  private getIndexOf(thisArg: object, callback: (...args: any[]) => void) {
    let result;
    for (let i = 0; i < this.callbacks.length; i++) {
      if (this.callbacks[i][0] === thisArg && this.callbacks[i][1] === callback) {
        result = i;
        break;
      }
    }
    return result;
  }
}
