import { Button } from './button';
import { Component } from './component';
import { Container } from './container';
export interface IComponentContainer {
    pushComponent(module: string, args?: object): void;
    getContent(): Container;
    back(): void;
    hide(focusToComponent: any, args: any, keepHistory: any, state: any, fromBack: any): void;
    getCurrentModule(): string;
    getCurrentArguments(): object;
}
export interface IHistoryItem {
    module: string;
    args: object;
    state: object;
    previousFocus: Button;
}
export declare class ComponentContainer extends Container implements IComponentContainer {
    static destroy(): void;
    private static knownComponents;
    private loadingIndex;
    private loadingModule;
    private currentModule;
    private currentComponent;
    private currentArgs;
    private historyStack;
    private previousFocus;
    /**
     * @param id
     */
    constructor(id?: string);
    /**
     *
     * @param module
     * @param args
     * @param keepHistory
     * @param state
     * @param fromBack
     * @param focus
     */
    showComponent(component: Component, args?: object, keepHistory?: boolean, state?: object, fromBack?: boolean, focus?: Button): void;
    /**
     * Pushes a component into the history stack of the container (and shows it).
     * @param module The requirejs module name of the component to show.
     * @param args An optional object to pass arguments to the component.
     */
    pushComponent(module: string, args?: object): void;
    /**
     * Returns the widget added to this container.
     */
    getContent(): Container;
    /**
     * Return this component container to the previous component in the history.
     */
    back(): void;
    /**
     * Hide the component within this container.
     * @param focusToComponent
     * @param args
     * @param keepHistory
     * @param state
     * @param fromBack
     */
    hideComponent(focusToComponent: string, args: object, keepHistory: boolean, state: object, fromBack: boolean): void;
    /**
     *
     */
    getCurrentModule(): string;
    /**
     *
     */
    getCurrentArguments(): object;
    /**
     *
     * @param module
     * @param componentClass
     * @param args
     * @param keepHistory
     * @param state
     */
    private loadComponentCallback(module, componentClass, args?, keepHistory?, state?);
}
