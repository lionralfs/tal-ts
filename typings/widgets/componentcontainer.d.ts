import { Button } from './button';
import { Container } from './container';
export interface IComponentContainer {
    show(module: string, args?: object, keepHistory?: boolean, state?: object, fromBack?: boolean, focus?: Button): void;
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
     *
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
    show(module: string, args?: object, keepHistory?: boolean, state?: object, fromBack?: boolean, focus?: Button): void;
    /**
     *
     */
    pushComponent(module: string, args?: object): void;
    /**
     *
     */
    getContent(): Container;
    /**
     *
     */
    back(): void;
    /**
     *
     * @param focusToComponent
     * @param args
     * @param keepHistory
     * @param state
     * @param fromBack
     */
    hide(focusToComponent: any, args: any, keepHistory: any, state: object, fromBack: any): void;
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
