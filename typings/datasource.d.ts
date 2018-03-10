import { Component } from '.';
import { BaseClass } from './class';
import { Iterator } from './iterator';
/**
 * Utility class to wrap disparate functions into a common interface for binding to lists.
 */
export declare class DataSource extends BaseClass {
    private request;
    private component;
    private obj;
    private func;
    private args;
    /**
     * @param component Component which 'owns' this data.
     * @param obj Object on which to call 'func' method.
     * @param func Name of function to call.
     * @param args Arguments to pass the function.
     */
    constructor(component: Component, obj: {
        onSuccess: () => void;
        onError: () => void;
    }, func: string, args: any[]);
    /**
     * Performs the request for data.
     * @param callbacks Object containing onSuccess and onError callback functions.
     */
    load(callbacks: {
        onSuccess: (data: Iterator | any[]) => void;
        onError: (response?: object) => void;
    }): void;
    /**
     * Aborts a currently loading request.
     */
    abort(): void;
}
