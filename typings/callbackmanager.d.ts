import { BaseClass } from './class';
/**
 * Utility class to deal with adding/removing callbacks and calling all current callbacks.
 */
export declare class CallbackManager extends BaseClass {
    private callbacks;
    constructor();
    /**
     * Add a callback.
     *
     * Note that failing to remove callbacks when you are finished with them can stop garbage collection
     * of objects/closures containing those callbacks and so create memory leaks in your application.
     * @param thisArg The object to use as "this" when calling the callback.
     * @param callback The callback function
     */
    addCallback(thisArg: object, callback: (...args: any[]) => void): void;
    /**
     * Remove the specified callback.
     * @param thisArg The object that was used as "this" when adding the callback.
     * @param callback The callback function
     */
    removeCallback(thisArg: object, callback: (...args: any[]) => void): void;
    /**
     * Remove all callbacks.
     */
    removeAllCallbacks(): void;
    /**
     * Call all callbacks, providing all supplied arguments to each of the calls.
     * @example manager.callAll(1);
     * @example manager.callAll(1,2,3,4);
     */
    callAll(...args: any[]): void;
    private getIndexOf(thisArg, callback);
}
