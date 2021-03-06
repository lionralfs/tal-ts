import { Button } from './button';
import { Component } from './component';
import { Container } from './container';
export interface IComponentContainer {
    pushComponent(component: Component, args?: object): void;
    getContent(): Container;
    back(): void;
    getCurrentArguments(): object;
}
export interface IHistoryItem {
    module: Component;
    args: object;
    state: object;
    previousFocus: Button;
}
export declare class ComponentContainer extends Container implements IComponentContainer {
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
    pushComponent(component: Component, args?: object): void;
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
    getCurrentArguments(): object;
}
